import postman from "../../postman.app.mjs";

export default {
  key: "postman-update-variable",
  name: "Update Environment Variable",
  description: "Updates a specific environment variable in Postman. [See the documentation](https://learning.postman.com/docs/developer/postman-api/intro-api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    postman,
    environmentId: {
      propDefinition: [
        postman,
        "environmentId",
      ],
    },
    environmentVariableKey: {
      propDefinition: [
        postman,
        "environmentVariableKey",
      ],
    },
    environmentVariableValue: {
      propDefinition: [
        postman,
        "environmentVariableValue",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.postman.updateEnvironmentVariable(
      this.environmentId,
      this.environmentVariableKey,
      this.environmentVariableValue,
    );

    $.export("$summary", `Successfully updated the variable "${this.environmentVariableKey}" in environment ID ${this.environmentId}`);
    return response;
  },
};
