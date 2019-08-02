import Controller from './controller';

export function method(httpMethod: string) {

  return controllerDecorator('method', httpMethod);

}

export function accept(mimeType: string) {

  return controllerDecorator('accept', mimeType);

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
