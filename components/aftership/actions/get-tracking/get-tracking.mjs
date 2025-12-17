import aftership from "../../aftership.app.mjs";

export default {
  key: "aftership-get-tracking",
  name: "Get Tracking",
  description: "Obtains an existing tracking system's data by ID. [See the documentation](https://www.aftership.com/docs/api/4/trackings/get-trackings)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    aftership,
    trackingId: {
      propDefinition: [
        aftership,
        "trackingId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.aftership.getTrackingById({
      $,
      trackingId: this.trackingId,
    });
    $.export("$summary", `Successfully retrieved tracking data for ID ${this.trackingId}`);
    return response;
  },
};
