import postman from "../../postman.app.mjs";

export default {
  key: "postman-create-environment",
  name: "Create Environment",
  description: "Creates a new environment in Postman. [See the documentation](https://learning.postman.com/docs/developer/postman-api/intro-api/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postman,
    workspaceId: {
      propDefinition: [
        postman,
        "workspaceId",
      ],
      optional: true,
    },
    environmentName: {
      type: "string",
      label: "New Environment Name",
      description: "The name for the new environment",
    },
    variablesCount: {
      type: "integer",
      label: "Variables Quantity",
      description: "The quantity of variables you want to create into the environment.",
      reloadProps: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.variablesCount) {
      for (var i = 1; i <= this.variablesCount; i++) {
        props[`variableKey_${i}`] = {
          type: "string",
          label: `Variable Name ${i}`,
          description: `The name for the variable ${i}`,
        };
        props[`variableValue_${i}`] = {
          type: "string",
          label: `Variable Value ${i}`,
          description: `The value for the variable ${i}`,
        };
        props[`variableEnabled_${i}`] = {
          type: "boolean",
          label: `Variable Enabled ${i}`,
          description: `Whether the variable ${i} is enabled or not.`,
        };
        props[`variableType_${i}`] = {
          type: "string",
          label: `Variable Type ${i}`,
          description: `The type of the variable ${i}`,
          options: [
            "secret",
            "default",
          ],
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const variables = [];
    for (var i = 1; i <= this.variablesCount; i++) {
      variables.push({
        key: this[`variableKey_${i}`],
        value: this[`variableValue_${i}`],
        enabled: this[`variableEnabled_${i}`],
        type: this[`variableType_${i}`],
      });
    }

    const response = await this.postman.createEnvironment({
      $,
      data: {
        environment: {
          name: this.environmentName,
          values: variables,
        },
      },
    });
    $.export("$summary", `Successfully created a new environment with ID: ${response.environment?.id}`);
    return response;
  },
};
