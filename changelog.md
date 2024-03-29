Changelog
=========

1.0.0 (2024-01-15)
------------------

* Finally! Curveball v1. Only took 6 years.
* CommonJS support has been dropped. The previous version of this library
  supported both CommonJS and ESM. The effort of this no longer feels worth it.
  ESM is the future, so we're dropping CommonJS.
* Now requires Node 18.
* Upgraded to Typescript 5.3.
* Using Typescript 5 decorators, which means `experimentalDecorators` (the
  old-style decorators) are no longer needed. If you are upgrading from an
  older version, you should remove `experimentalDecorators`.
* Decorators/Annotations for which the method can not be determined (either
  because the method is not a well-known http method and there is no `@method`
  annotation), we will now only warn and not crash.


0.5.0 (2023-02-14)
------------------

* This package now supports ESM and CommonJS modules.
* No longer supports Node 14. Please use Node 16 or higher.


0.4.0 (2022-09-03)
------------------

* Upgraded from `@curveball/core` to `@curveball/kernel`.


0.3.1 (2021-05-06)
------------------

* Releasing on Github packages.
* Updated lint rules
* Updated dependencies
* No functional changes


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
