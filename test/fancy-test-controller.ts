import { Controller, method, accept } from '../src';
import { Context } from '@curveball/core';

export default class FancyTestController extends Controller {

  @method('GET')
  @accept('html')
  getHtml(ctx: Context) {

    ctx.response.body = 'Well hello there';

  }

  @method('GET')
  @accept('json')
  @accept('application/hal+json')
  getJson(ctx: Context) {

    ctx.response.body = { foo: 'bar' }

  }

  @method('POST')
  notPost(ctx: Context) {

    ctx.response.body = 'actually it was POST'

  }

}
