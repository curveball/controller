import { Application } from '@curveball/kernel';
import { expect } from 'chai';
import FancyTestController from './fancy-test-controller';
import BrokenTestController from './test-controller-broken';

describe('Controller Decorators', () => {

  it('should respond to HTTP requests', async () => {

    const app = new Application();
    app.use(new FancyTestController());
    const response = await app.subRequest('GET', '/');

    expect(response.body).to.equal('Well hello there');

  });

  it('should automatically respond to OPTIONS requests', async () => {

    const app = new Application();
    app.use(new FancyTestController());
    const response = await app.subRequest('OPTIONS', '/');
    expect(response.status).to.equal(200);
    expect(response.headers.get('Allow')).to.equal('GET, POST, PUT, REPORT, OPTIONS');

  });

  it('should respond with a 501 for unrecognized HTTP methods', async () => {

    const app = new Application();
    app.use(new FancyTestController());
    const response = await app.subRequest('TIMHORTONS', '/');
    expect(response.status).to.equal(501);

  });

  it('should respond with a 405 for methods that aren\'t registered', async () => {

    const app = new Application();
    app.use(new FancyTestController());
    const response = await app.subRequest('PATCH', '/');
    expect(response.status).to.equal(405);

  });

  it('should automatically wire to the getJson() method for accept:aplication/hal+json', async() => {

    const app = new Application();
    app.use(new FancyTestController());
    const response = await app.subRequest('GET', '/', { 'Accept': 'application/hal+json' });

    expect(response.body).to.eql({ foo: 'bar' });

  });

  it('should automatically wire to the notPost() method for POST requests', async() => {

    const app = new Application();
    app.use(new FancyTestController());
    const response = await app.subRequest('POST', '/');

    expect(response.body).to.equal('actually it was POST');

  });

  it('should throw Not Acceptable for not-recognized Accept headers on GET', async() => {

    const app = new Application();
    app.use(new FancyTestController());
    const response = await app.subRequest('GET', '/', { 'Accept': 'image/jpeg' });

    expect(response.status).to.equal(406);

  });
  it('should throw Not Acceptable for not-recognized Accept headers on PUT', async() => {

    const app = new Application();
    app.use(new FancyTestController());
    const response = await app.subRequest('GET', '/', { 'Accept': 'image/jpeg' });

    expect(response.status).to.equal(406);

  });
  it('should throw an error when instantiating a controller with an unreacheable method', async() => {

    expect(() => {
      new BrokenTestController();
    }).to.throw(Error);

  });

});
