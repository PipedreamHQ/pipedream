import postman from "../../postman.app.mjs";

export default {
  key: "postman-update-variable",
  name: "Update Environment Variable",
  description: "Updates a specific environment variable in Postman. [See the documentation](https://learning.postman.com/docs/developer/postman-api/intro-api/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    environmentId: {
      propDefinition: [
        postman,
        "environmentId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
    variable: {
      propDefinition: [
        postman,
        "variable",
        ({ environmentId }) => ({
          environmentId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.variable) {
      const { environment: { values: variables } } = await this.postman.getEnvironment({
        environmentId: this.environmentId,
      });
      const indexVar = variables.findIndex((variable) => variable.key === this.variable);
      const variable = variables[indexVar];

      props.variableValue = {
        type: "string",
        label: "Variable Value",
        description: "The value for the variable",
      };
      props.variableEnabled = {
        type: "boolean",
        label: "Variable Enabled",
        description: "Whether the variable is enabled or not.",
        default: variable.enabled,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      postman,
      environmentId,
    } = this;

    const { environment } = await postman.getEnvironment({
      $,
      environmentId,
    });

    const indexVar = environment.values.findIndex((variable) => variable.key === this.variable);
    environment.values[indexVar] = {
      ...environment.values[indexVar],
      value: this.variableValue,
      enabled: this.variableEnabled,
    };

    // This step is to delete all variables and create them again.
    // Without this step, the postman will only update the variables` initial value.
    await postman.updateEnvironment({
      $,
      environmentId,
      data: {
        environment: {
          values: [],
        },
      },
    });

    const response = await postman.updateEnvironment({
      $,
      environmentId,
      data: {
        environment: {
          values: environment.values,
        },
      },
    });

    $.export("$summary", `Successfully updated the variable "${this.variable}" in environment ID ${this.environmentId}`);
    return response;
  },
};
