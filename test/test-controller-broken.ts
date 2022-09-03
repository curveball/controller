import { Controller, accept } from '../src';
import { Context } from '@curveball/kernel';

export default class TestControllerBroken extends Controller {

  @accept('text/html')
  foo(ctx: Context) {

    ctx.response.body = 'This will not be reached';

  }

}
