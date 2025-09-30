import app from "../../google_tag_manager.app.mjs";

export default {
  name: "Update Tag",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "google_tag_manager-update-variable",
  description: "Update a variable in a workspace. [See the documentation](https://developers.google.com/tag-platform/tag-manager/api/v2/reference/accounts/containers/workspaces/variables/update)",
  type: "action",
  props: {
    app,
    accountId: {
      optional: false,
      propDefinition: [
        app,
        "accountId",
      ],
    },
    containerId: {
      optional: false,
      propDefinition: [
        app,
        "containerId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    workspaceId: {
      optional: false,
      propDefinition: [
        app,
        "workspaceId",
        (c) => ({
          accountId: c.accountId,
          containerId: c.containerId,
        }),
      ],
    },
    variableId: {
      optional: false,
      propDefinition: [
        app,
        "variableId",
        (c) => ({
          accountId: c.accountId,
          containerId: c.containerId,
          workspaceId: c.workspaceId,
        }),
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "The name of the variable",
      optional: false,
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
      description: "The type of the variable. E.g. `jsm`",
      optional: false,
    },
    parameter: {
      propDefinition: [
        app,
        "parameter",
      ],
      description: "The list of parameters for the variable",
      optional: false,
    },
    formatValue: {
      label: "Format Value",
      type: "string",
      description: "The formatValue object for the variable",
      optional: true,
    },
  },
  async run({ $ }) {
    const parameter = typeof this.parameter === "string"
      ? JSON.parse(this.parameter)
      : this.parameter;

    const formatValue = typeof this.formatValue === "string"
      ? JSON.parse(this.formatValue)
      : this.formatValue;

    const response = await this.app.updateVariable({
      $,
      accountId: this.accountId,
      containerId: this.containerId,
      workspaceId: this.workspaceId,
      variableId: this.variableId,
      data: {
        name: this.name,
        type: this.type,
        parameter,
        formatValue,
        vendorTemplate: {
          key: {},
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated variable with ID ${response.variableId}`);
    }

    return response;
  },
};
