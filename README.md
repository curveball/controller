Curveball Controller
=====================

This package provides a simple controller pattern for curveballjs
applications.

It's usage in the Curveball framework is entrirely optional, but it makes
designing resource-oriented API's easier.

Basic features

* Handles all methods for a single route in an application.
* Implements the `OPTIONS` method and returns all supported HTTP methods in
  an `Allow` header.
* Automatically throws a `405 Method Not Allowed` for unsupported methods.
* Support for negotiating the `Accept` header.


Installation
------------

    npm install @curveball/controller


Getting started
---------------

To create a controller, subclass the main controller. HTTP methods are
represented by methods on the class.

```typescript
import Controller from '@curveball/controller';
import { Context } from '@curveball/core';

class MyController extends Controller {

  get(ctx: Context) {

    ctx.response.body = 'Hello world';

  }

}
```

To use your controller, you probably want to use the [@curveball/router][2]
package:

```typescript
import { Application } from '@curveball/core';
import { router } from '@curveball/router';

const app = new Application();

app.use(
  router('/hello-world', new MyController())
);
```

Differences from common frameworks
----------------------------------

Every controller is responsible for exactly 1 route in your application.
A controller is a ES6 class, and it's methods match HTTP methods.

This makes it slightly different from common controllers from many popular
frameworks, where a single controller typically handles a 'group' of
functionality with `index`, `create`, `update`, `read` and `delete` functions.

To model the same index, create, update, read, delete functions with this
controller, you just need two controllers instead:

```typescript
class Collection extends Controller {

  get(ctx: Context) {
    // index
  }

  post(ctx: Context) {
    // create
  }

}

class Item extends Controller {

  get(ctx: Context) {
    // read
  }

  put(ctx: Context) {
    // update
  }

  delete(ctx: Context) {
    // delete
  }
}
```

And then to use them:

```typescript
import { Application } from '@curveball/core';
import { router } from '@curveball/router';

const app = new Application();

app.use(
  router('/articles', new Collection())
);
app.use(
  router('/articles/:id', new Item())
);
```

Negotiating the Accept header
-----------------------------

If you API supports multiple formats, for example `json` and `html`, you can
use the `@accept` and `@method` annotations to automatically handle these.

```typescript
import { Controller, method, accept } from '@curveball/controller';
import { Context } from '@curveball/core';

class MyFancyController extends Controller {

  @method('GET')
  @accept('application/json')
  getJson(ctx: Context) {

    ctx.response.type = 'application/json';
    ctx.response.body = { 'hello': 'world' };

  }

  @method('GET')
  @accept('html')
  getHtml(ctx: Context) {

    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello world</h1>';

  }

}
```

This controller uses the `@method` annotation to automatically route
a HTTP method to a controller function.

If there was no match for the `@accept` annotation, the server will
automatically throw `406 Not Acceptable`.

It's possible to specify multiple `@accept` annotations. The `@accept`
annotation contains a mimetype, but it's possible to only specify a part of
the mimetype. For example, the following values for the `@accept` annotation
will all match `application/hal+json`:

* `json`
* `application/*`
* `*/json`
* `application/json`
* `application/hal+json`
* `hal+json`
* `application/hal+json; version=2`

To make a specific function match any accept header, you can add an `@accept('*')`
annotation


WebSocket Support
-----------------

The Controller has built-in WebSocket support. Sample usage:


```typescript
import { Controller } from '@curveball/controller';
import { Application, WsContext } from '@curveball/core';

class MyController extends Controller {

  webSocket(ctx: WsContext) {

    ctx.webSocket.send('Hello');

  }

}

const app = new Application();
app.use(new MyController());

// Listen on port 5000 for Websocket
app.listenWs(5000);
```


[1]: https://github.com/curveball/
[2]: https://github.com/curveball/router
