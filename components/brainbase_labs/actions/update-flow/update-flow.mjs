import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase_labs-update-flow",
  name: "Update Flow",
  description:
    "Update an existing flow. [See the documentation](https://docs.usebrainbase.com/api-reference/flows/update-a-flow)",
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
    flowId: {
      propDefinition: [
        app,
        "flowId",
        (c) => ({
          workerId: c.workerId,
        }),
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
    variables: {
      type: "string",
      label: "Variables",
      description: "Flow variables",
    },
    validate: {
      type: "boolean",
      label: "Validate",
      description: "Whether to validate the flow",
    },
    label: {
      type: "string",
      label: "Label",
      description: "Optional label for the flow",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.updateFlow({
      $,
      workerId: this.workerId,
      flowId: this.flowId,
      data: {
        name: this.name,
        code: this.code,
        variables: this.variables,
        validate: this.validate,
        label: this.label,
      },
    });

    $.export("$summary", `Successfully updated flow "${this.name}"`);
    return response;
  },
};
