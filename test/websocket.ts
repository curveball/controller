import * as WebSocketImp from 'ws';
import { Controller } from '../src/index.js';
import { Application, WsContext } from '@curveball/core';
import { expect } from 'chai';

// @ts-expect-error ESM shenanigans
const WebSocket = WebSocketImp.default ?? WebSocketImp;

class WsController extends Controller {

  webSocket(ctx: WsContext) {

    ctx.webSocket.send('Hello');

  }

}
describe('Websocket support', () => {

  it('should start a websocket server', () => {

    const app = new Application();
    app.use(new WsController());
    const wss = app.listenWs(57001);

    return new Promise<void>(res => {
      const ws = new WebSocket('ws://localhost:57001');
      ws.on('message', (msg:any) => {

        expect(msg.toString()).to.equal('Hello');
        ws.close();
        wss.close();
        res();

      });

    });


  });

});
