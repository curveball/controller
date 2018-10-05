import { Context, middlewareCall } from '@curveball/core';
import { NotImplemented, MethodNotAllowed } from '@curveball/http-errors';
import http from 'http';

export default class Controller {

  dispatch(ctx: Context): Promise<void> | void {

    const method = ctx.request.method;
    if (!http.METHODS.includes(method)) {
      throw new NotImplemented(method + ' is not implemented');
    }
    if ((<any> this)[method.toLowerCase()] === undefined) {
      throw new MethodNotAllowed(
        method + ' is not allowed',
        this.allowedMethods()
      );
    }

    ctx.response.headers.set('Content-Type', 'application/hal+json');
    return (<any> this)[method.toLowerCase()](ctx);

  }

  allowedMethods(): string[] {

    const result = [];
    for (const method of http.METHODS) {

      if ((<any> this)[method.toLowerCase()] !== undefined) {
        result.push(method);
      }

    }
    return result;

  }

  [middlewareCall](ctx: Context): Promise<void> | void {

    return this.dispatch(ctx);

  };

}
