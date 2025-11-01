import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase-delete-integration",
  name: "Delete Integration",
  description: "Delete an existing Twilio integration. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    integrationId: {
      propDefinition: [
        app,
        "integrationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteIntegration({
      $,
      integrationId: this.integrationId,
    });

    $.export("$summary", `Successfully deleted integration with ID ${this.integrationId}`);
    return response;
  },
};

