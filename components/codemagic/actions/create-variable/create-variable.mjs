import app from "../../codemagic.app.mjs";

export default {
  key: "codemagic-create-variable",
  name: "Create Variable",
  description: "Create a variable in the specified workflow. [See the documentation](https://docs.codemagic.io/rest-api/applications/#add-new-variable)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    appId: {
      propDefinition: [
        app,
        "appId",
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
    group: {
      propDefinition: [
        app,
        "group",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createVariable({
      $,
      appId: this.appId,
      data: {
        key: this.key,
        value: this.value,
        workflowId: this.workflowID,
        group: this.group,
      },
    });

    $.export("$summary", `Successfully created variable '${this.key}'`);

    return response;
  },
};
