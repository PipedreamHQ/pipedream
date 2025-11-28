import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase_labs-list-integrations",
  name: "List Integrations",
  description:
    "Get all integrations for the authenticated team. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listIntegrations({
      $,
    });

    $.export(
      "$summary",
      `Successfully retrieved ${response.data?.length || 0} integration(s)`,
    );
    return response;
  },
};
