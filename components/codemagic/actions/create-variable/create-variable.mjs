import app from "../../codemagic.app.mjs";

export default {
  key: "codemagic-create-variable",
  name: "Create Variable",
  description: "Create a variable in the specified workflow. [See the documentation](https://docs.codemagic.io/rest-api/applications/#add-new-variable)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    appID: {
      propDefinition: [
        app,
        "appID",
      ],
    },
    workflowID: {
      propDefinition: [
        app,
        "workflowID",
      ],
    },
    key: {
      propDefinition: [
        app,
        "key",
      ],
    },
    value: {
      propDefinition: [
        app,
        "value",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listVariables({
      $,
      app_id: this.appID,
      data: {
        key: this.key,
        value: this.value,
        workflowId: this.workflowID,
      },
    });

    $.export("$summary", `Successfully created variable '${this.key}'`);

    return response;
  },
};
