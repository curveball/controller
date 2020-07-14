import WebSocket from 'ws';
import { Controller } from '../src';
import { Application, WsContext } from '@curveball/core';
import { expect } from 'chai';

class WsController extends Controller {

  webSocket(ctx: WsContext) {

    ctx.webSocket.send('Hello');

  }

}
describe("Websocket support", () => {

  it('should start a websocket server', () => {

    const app = new Application();
    app.use(new WsController());
    const wss = app.listenWs(57001);
   
    return new Promise(res => {
      const ws = new WebSocket('ws://localhost:57001');
      ws.on('message', (msg) => {

        expect(msg).to.equal('Hello');
        ws.close();
        wss.close();
        res();

      });

    });


  });

});
