import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-tracking",
  name: "Retrieve Tracking",
  description: "Retrieve a tracking record by ID. [See the documentation](https://developer.surecart.com/api-reference/trackings/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    trackingId: {
      propDefinition: [
        surecart,
        "trackingId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getTracking({
      $,
      trackingId: this.trackingId,
    });
    $.export("$summary", `Successfully retrieved tracking record ${this.trackingId}`);
    return response;
  },
};
