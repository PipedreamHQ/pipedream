import app from "../../codacy.app.mjs";

export default {
  key: "codacy-delete-integration",
  name: "Delete Integration",
  description: "Delete integration for the authenticated user. [See the documentation](https://api.codacy.com/api/api-docs?http#deleteintegration)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    accountProvider: {
      propDefinition: [
        app,
        "accountProvider",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteIntegration({
      $,
      accountProvider: this.accountProvider,
    });

    $.export("$summary", `Successfully deleted integration with ${this.accountProvider}`);

    return response;
  },
};
