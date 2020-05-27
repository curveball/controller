import { Middleware } from '@curveball/core';
import Controller from './controller';

export function method(httpMethod: string) {

  return controllerDecorator('method', httpMethod);

}

export function accept(mimeType: string) {

  return controllerDecorator('accept', mimeType);

}

/**
 * This function returns a decorator which allows middleware to be applied to a specific controller route
 */
export function middleware(mw: Middleware) {

  return (target: Controller, propertyKey: string) => {

    if (!target.middleware) {
      target.middleware = new Map();
    }

    if (!target.middleware.has(propertyKey)) {
      target.middleware.set(propertyKey, []);
    }
    target.middleware.get(propertyKey)!.push(mw);

  };

}

/**
 * This function returns a very simple decorator.
 *
 * All it does is take the name of the annotation, the arguments that were
 * passed and add their contents to a 'annotations' property on the
 * controller.
 */
export function controllerDecorator(annotationName: string, ...args: any[]) {

  return (target: Controller, propertyKey: string) => {

    if (!target.annotations) {
      target.annotations = new Map();
    }

    if (!target.annotations.has(propertyKey)) {
      target.annotations.set(propertyKey, []);
    }
    target.annotations.get(propertyKey)!.push({
      name: annotationName,
      args: args
    });

  };

}
