import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase-create-flow",
  name: "Create Flow",
  description: "Create a new flow for a worker. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    workerId: {
      propDefinition: [
        app,
        "workerId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the flow",
    },
    code: {
      type: "string",
      label: "Code",
      description: "The flow code/definition",
    },
    label: {
      type: "string",
      label: "Label",
      description: "Optional label for the flow",
      optional: true,
    },
    variables: {
      type: "string",
      label: "Variables",
      description: "Flow variables (optional)",
      optional: true,
    },
    validate: {
      type: "boolean",
      label: "Validate",
      description: "Whether to validate the flow",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createFlow({
      $,
      workerId: this.workerId,
      data: {
        name: this.name,
        code: this.code,
        label: this.label,
        variables: this.variables,
        validate: this.validate,
      },
    });

    $.export("$summary", `Successfully created flow "${this.name}"`);
    return response;
  },
};

