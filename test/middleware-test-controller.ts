import { Context } from '@curveball/core';
import { BadRequest } from '@curveball/http-errors';
import { Controller } from '../src';
import { method, middleware } from '../src/decorators';

async function badRequestMiddleware(ctx: Context) {
  throw new BadRequest('This request was bad');
}

async function oneMiddleware(ctx: Context, next: () => Promise<void>) {
  ctx.response.body = 'One';
  await next();
}

async function twoMiddleware(ctx: Context, next: () => Promise<void>) {
  ctx.response.body = ctx.response.body + ' Two';
  await next();
}

export default class MiddlewareController extends Controller {

  @method('GET')
  @middleware(badRequestMiddleware)
  get(ctx: Context) {
    ctx.response.body = { foo: 'bar' };
  }

  @method('POST')
  @middleware(oneMiddleware)
  @middleware(twoMiddleware)
  post(ctx: Context) {
    ctx.response.body = ctx.response.body + ' Three';
  }

}
