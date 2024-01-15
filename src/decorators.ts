import Controller from './controller.js';

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

  return function actualDecorator(_originalMethod: any, context: ClassMethodDecoratorContext<Controller>) {

    context.addInitializer(function() {

      const methodName = String(context.name);

      if (!this.annotations) {
        this.annotations = new Map();
      }

      if (!this.annotations.has(methodName)) {
        this.annotations.set(methodName, []);
      }
      this.annotations.get(methodName)!.push({
        name: annotationName,
        args: args
      });

    });

  };

}
