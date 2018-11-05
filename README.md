Curveball Controller
=====================

This package provides a very simple controller pattern for curveballjs
applications.

It's usage is entrirely optional, and it's meant to implement exactly one
design pattern.


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

We think it's better design.

To model the same idea in with this package, you must do it with 2 controllers:

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

[1]: https://github.com/curveballjs/
[2]: https://github.com/curveballjs/router
