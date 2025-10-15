import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase-get-integration",
  name: "Get Integration",
  description: "Get a specific integration by ID. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
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
    const response = await this.app.getIntegration({
      $,
      integrationId: this.integrationId,
    });

    $.export("$summary", `Successfully retrieved integration with ID ${this.integrationId}`);
    return response;
  },
};

