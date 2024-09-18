export default {
  type: "app",
  app: "error",
  propDefinitions: {
    name: {
      type: "string",
      label: "Error Name",
      description:
        "The **name** (class) of error to throw, which you can define as any custom string. This will show up in all of the standard Pipedream error handling destinations.",
      default: "Error",
    },
    errorMessage: {
      type: "string",
      label: "Error Message",
      description:
        "The error **message** to throw. This will show up in all of the standard Pipedream error handling destinations.",
      optional: true,
    },
  },
  methods: {
    maybeCreateAndThrowError(name, message) {
      const errorClass = global[name];

      // Check if the error class exists and is a subclass of Error
      if (
        typeof errorClass === "function" &&
        errorClass.prototype.isPrototypeOf.call(Error)
      ) {
        throw new errorClass(message);
      }

      class DynamicError extends Error {
        constructor(msg) {
          super(msg);
          this.name = name;
        }
      }
      throw new DynamicError(message);
    },
  },
};
