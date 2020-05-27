import { Context, invokeMiddlewares, Middleware, middlewareCall } from '@curveball/core';
import { MethodNotAllowed, NotAcceptable, NotImplemented } from '@curveball/http-errors';
import http from 'http';
import { MethodAnnotation, RouteTable } from './types';

export default class Controller {

  annotations: Map<string, MethodAnnotation[]>;
  middleware: Map<string, Middleware[]>;
  routeTable: RouteTable;

  constructor() {

    this.autoAnnotateHttpMethods();
    this.middleware = this.middleware === undefined ? new Map() : this.middleware;
    this.createRouteTable();

  }

  /**
   * Returns a list of allowed HTTP methods for this controller.
   */
  allowedMethods(): string[] {

    return Array.from(this.routeTable.keys());

  }

  /**
   * The default implementation of the HTTP OPTIONS requests automatically
   * responds with an empty body an an Allow header
   */
  options(ctx: Context) {

    ctx.response.headers.set('Allow', this.allowedMethods());

  }

  /**
   * This middlewareCall symbol is a special function that marks
   * an object as a curveball middleware.
   *
   * This function will be called by curveball when it's added to
   * the middleware stack with use().
   */
  [middlewareCall](ctx: Context): Promise<void> | void {

    return this.dispatch(ctx);

  }

  /**
   * This is the main request handler.
   *
   * It takes a context and figures out which controller method
   * to call, and then calls it.
   */
  dispatch(ctx: Context): Promise<void> | void {

    const method = ctx.request.method;
    if (!http.METHODS.includes(method)) {
      throw new NotImplemented(method + ' is not implemented');
    }
    if (!this.routeTable.has(method)) {
      throw new MethodNotAllowed(
        method + ' is not allowed',
        this.allowedMethods()
      );
    }

    const route = this.routeTable.get(method)!;
    const acceptsMimeTypes = Array.from(route.accepts.keys());
    const acceptsResult = ctx.accepts(...acceptsMimeTypes);
    let controllerMethod;
    if (!acceptsResult || !route.accepts.has(acceptsResult)) {
      if (!route.default) {
        throw new NotAcceptable('The mimeType specified in the Accept header is not supported. The following mimetypes are supported here: ' + acceptsMimeTypes.join(', ') );
      } else {
        controllerMethod = route.default;
      }
    } else {
      controllerMethod = route.accepts.get(acceptsResult)!;
    }

    return route.middleware === undefined
      ? (<any> this)[controllerMethod](ctx)
      : invokeMiddlewares(ctx, [...route.middleware.reverse(), (<any> this)[controllerMethod]]);

  }

  /**
   * For any methods on a controller that are identical in name to a HTTP
   * method, we pretend that these methods had a `@method('FOO')` annotation.
   */
  private autoAnnotateHttpMethods(): void {
    if (!this.annotations) {
      this.annotations = new Map();
    }
    for (const httpMethod of http.METHODS) {
      const method = httpMethod.toLowerCase();
      if (typeof (<any> this)[method] === 'function') {
        if (!this.annotations.has(method)) {
          this.annotations.set(method, [{name: 'method', args: [httpMethod]}]);
        } else {
          let hasAnnotation = false;
          // Only add a method annotation if it didn't already exist.
          for (const annotation of this.annotations.get(method)!) {
            if (annotation.name === 'method') {
              hasAnnotation = true;
            }
          }
          if (!hasAnnotation) {
            this.annotations.get(method)!.push({
              name: 'method',
              args: [httpMethod]}
            );
          }
        }
      }
    }

  }

  /**
   * This method uses the information from annotations to create
   * routes
   */
  private createRouteTable(): void {

    this.routeTable = new Map();
    for (const [controllerMethod, annotations] of this.annotations) {

      const accepts: string[] = [];
      let method: string|null = null;

      for (const annotation of annotations) {
        switch (annotation.name) {
          case 'method' :
            method = annotation.args[0];
            break;
          case 'accept' :
            accepts.push(annotation.args[0]);
            break;
        }
      }

      if (method === null) {
        throw new Error('Controller method ' + controllerMethod + ' was annotated, but it needs a @method annotation to actually do anything');
      }

      if (!this.routeTable.has(method)) {
        this.routeTable.set(method, {
          accepts: new Map(),
          default: null,
          middleware: this.middleware.get(controllerMethod),
        });
      }
      const route = this.routeTable.get(method)!;

      route.middleware = this.middleware.get(controllerMethod);

      if (accepts.length === 0) {
        route.default = controllerMethod;
      } else {
        for (const mime of accepts) {
          if (mime === '*') {
            route.default = controllerMethod;
          } else {
            route.accepts.set(mime, controllerMethod);
          }
        }
      }

    }

  }

}
