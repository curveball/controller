/* eslint @typescript-eslint/no-unused-vars:0 */
import { Context, middlewareCall, WsContext } from '@curveball/kernel';
import { MethodNotAllowed, NotAcceptable, NotImplemented, BadRequest } from '@curveball/http-errors';
import * as http from 'node:http';
import { MethodAnnotation, RouteTable } from './types.js';

export default class Controller {

  annotations!: Map<string, MethodAnnotation[]>;
  routeTable!: RouteTable;

  constructor() {
    this.autoAnnotateHttpMethods();
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
   * Handle Websocket requests
   */
  webSocket(_ctx: WsContext): void | Promise<void> {

    throw new BadRequest('Websocket connections are not supported at this endpoint');

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

    if (!this.routeTable) {
      this.rebuildRouteTable();
    }
    const method = ctx.request.method;
    if (!http.METHODS.includes(method)) {
      throw new NotImplemented(method + ' is not implemented');
    }

    if (isWsContext(ctx)) {
      return this.webSocket(ctx);
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
    if (!acceptsResult || !route.accepts.has(acceptsResult)) {
      if (!route.default) {
        throw new NotAcceptable('The mimeType specified in the Accept header is not supported. The following mimetypes are supported here: ' + acceptsMimeTypes.join(', ') );
      } else {
        return (this as any)[route.default](ctx);
      }
    } else {
      return (this as any)[route.accepts.get(acceptsResult)!](ctx);
    }

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
      if (typeof (this as any)[method] === 'function') {
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
   * This method uses the information from annotations and class methods to
   * create an optimized route table.
   */
  private rebuildRouteTable(): void {

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
        console.error(`[ERROR] Controller method "${controllerMethod}" was annotated, but it needs a @method annotation to actually do anything`);
        continue;
      }

      if (!this.routeTable.has(method)) {
        this.routeTable.set(method, {
          accepts: new Map(),
          default: null
        });
      }
      const route = this.routeTable.get(method)!;

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

function isWsContext(ctx: Context): ctx is WsContext {

  return ctx.webSocket!==undefined;

}
