import error from "../../error.app.mjs";

export default {
  name: "Throw Error",
  version: "0.0.1",
  key: "error-throw-error",
  description: "Quickly throw an error from your workflow.",
  props: {
    error,
    name: {
      propDefinition: [
        error,
        "name",
      ],
    },
    errorMessage: {
      propDefinition: [
        error,
        "errorMessage",
      ],
    },
  },
  type: "action",
  async run() {
    this.error.maybeCreateAndThrowError(this.name, this.errorMessage);
  },
};
