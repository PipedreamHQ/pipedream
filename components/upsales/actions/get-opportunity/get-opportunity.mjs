import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-opportunity",
  name: "Get Opportunity",
  description: "Retrieves a specific opportunity from Upsales. [See the documentation](https://api.upsales.com/#b8dfce4a-4627-427d-8aa4-50ce2487f0d1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    opportunityId: {
      propDefinition: [
        app,
        "opportunityId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getOrder({
      $,
      orderId: this.opportunityId,
    });
    $.export("$summary", `Successfully retrieved opportunity: ${response.description || this.opportunityId}`);
    return response;
  },
};
