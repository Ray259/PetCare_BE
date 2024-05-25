export function ApplyToAllProperties(
  decorator: PropertyDecorator,
): ClassDecorator {
  return function (constructor: any) {
    const properties = Reflect.ownKeys(constructor.prototype);

    properties.forEach((property) => {
      if (typeof property === 'string') {
        decorator(constructor.prototype, property);
      }
    });
  };
}
