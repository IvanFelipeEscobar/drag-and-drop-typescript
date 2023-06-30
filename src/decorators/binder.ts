
   export const binder = (_: any, _2: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        const adjDesc: PropertyDescriptor = {
          configurable: true,
          get() {
            const boundFunc = originalMethod.bind(this);
            return boundFunc;
          },
        };
    
        return adjDesc;
      };
