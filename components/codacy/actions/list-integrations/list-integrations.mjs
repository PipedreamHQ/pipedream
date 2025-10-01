import app from "../../codacy.app.mjs";

export default {
  key: "codacy-list-integrations",
  name: "List Integrations",
  description: "List integrations on Codacy. [See the documentation](https://api.codacy.com/api/api-docs?http#listuserintegrations)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listIntegrations({
      $,
    });

    $.export("$summary", `Successfully listed ${response.data.length} integration(s).`);

    return response;
  },
};
