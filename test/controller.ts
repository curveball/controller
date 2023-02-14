import { Application } from '@curveball/kernel';
import { expect } from 'chai';
import TestController from './test-controller.js';

describe('Controller', () => {

  it('should work respond to HTTP requests', async () => {

    const app = new Application();
    app.use(new TestController());
    const response = await app.subRequest('GET', '/');

    expect(response.body).to.equal('Well hello there');

  });

  it('should automatically respond to OPTIONS requests', async () => {

    const app = new Application();
    app.use(new TestController());
    const response = await app.subRequest('OPTIONS', '/');
    expect(response.status).to.equal(200);
    expect(response.headers.get('Allow')).to.equal('GET, OPTIONS');

  });

  it('should respond with a 501 for unrecognized HTTP methods', async () => {

    const app = new Application();
    app.use(new TestController());
    const response = await app.subRequest('TIMHORTONS', '/');
    expect(response.status).to.equal(501);

  });

  it('should respond with a 405 for methods that aren\'t registered', async () => {

    const app = new Application();
    app.use(new TestController());
    const response = await app.subRequest('PUT', '/');
    expect(response.status).to.equal(405);

  });
});
