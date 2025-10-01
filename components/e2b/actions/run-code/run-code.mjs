import app from "../../e2b.app.mjs";

export default {
  key: "e2b-run-code",
  name: "Run Code",
  description: "Run or interpret code using the E2B service. [See the documentation](https://www.npmjs.com/package/e2b).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    code: {
      type: "string",
      label: "Code",
      description: "The code that will be interpreted by the E2B service. Eg. `print('Hello, World!')`.",
    },
  },
  async run({ $ }) {
    const {
      app,
      code,
    } = this;

    const response = await app.runCode(code);

    $.export("$summary", "Successfully interpreted code.");

    return response;
  },
};
