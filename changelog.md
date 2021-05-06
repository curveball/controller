Changelog
=========

0.3.1 (2021-05-06)
------------------

* Releasing on Github packages.
* Updated lint rules
* Updated dependencies
* No functional change

0.3.0 (2020-08-02)
------------------

* WebSocket support. If you create a function named `webSocket` in your
  controller, it will be automatically called when a websocket connection is
  opened.
* Typescript target is now `es2019` instead of `esnext` to ensure that older
  Node.js versions are supported.


0.2.2 (2020-01-05)
------------------

* Allow installation on Curveball 0.10.


0.2.1 (2019-09-13)
------------------

* @curveball/core got an update, so this updates all dependencies.


0.2.0 (2019-08-13)
------------------

* Added support for `@method` and `@accept` annotations for automated content
  negotiation.
* Automatically throw `406 Not Acceptable` when there was no matching `Accept`
  header.


0.1.0 (2019-03-29)
------------------

* First public version.
* Updated dependencies.


0.0.2 (2018-11-04)
------------------

* Updated dependencies. Fixed bugs


0.0.1 (2018-07-02)
------------------

* First version
