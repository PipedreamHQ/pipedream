import app from "../../airops.app.mjs";

export default {
  name: "Run Workflow",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "airops-run-workflow",
  description: "Run a workflow of an app. See the [sync documentation](https://docs.airops.com/reference/create-execution) or [async documentation](https://docs.airops.com/reference/create-async-execution)",
  type: "action",
  props: {
    app,
    appId: {
      label: "App ID",
      type: "string",
      description: "The app ID. [You can get you app ID here](https://docs.airops.com/reference/uuid)",
    },
    inputs: {
      label: "Inputs",
      type: "object",
      description: "Input fields for executing the app",
    },
    asynchronous: {
      label: "Run Asynchronous",
      type: "boolean",
      description: "Execute the workflow asynchronous",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const inputs = typeof this.inputs === "string"
      ? JSON.parse(this.inputs)
      : this.inputs;

    const response = await this.app.runWorkflow({
      $,
      appId: this.appId,
      async: this.asynchronous,
      data: {
        inputs,
      },
    });

    if (response) {
      $.export("$summary", "Successfully ran workflow");
    }

    return response;
  },
};
