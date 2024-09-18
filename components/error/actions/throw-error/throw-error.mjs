import app from "../../error.app.mjs";

export default {
  name: "Throw Error",
  version: "0.0.1",
  key: "error-throw-error",
  description: "Quickly throw an error from your workflow.",
  props: {
    app,
    errorMessage: {
      type: "string",
      label: "Error Message",
      description: "The error message to throw",
    },
  },
  type: "action",
  async run() {
    throw new Error(this.errorMessage);
  },
};
