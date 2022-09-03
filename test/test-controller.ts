import Controller from '../src';
import { Context } from '@curveball/kernel';

export default class TestController extends Controller {

  get(ctx: Context) {

    ctx.response.body = 'Well hello there';

  }

}
