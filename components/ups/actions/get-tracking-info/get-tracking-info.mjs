import ups from "../../ups.app.mjs";

export default {
  key: "ups-get-tracking-info",
  name: "Get Tracking Info",
  description: "Get tracking information for a UPS tracking number. [See the documentation](https://developer.ups.com/tag/Tracking?loc=en_US#operation/getSingleTrackResponseUsingGET)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ups,
    trackingNumber: {
      propDefinition: [
        ups,
        "trackingNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ups.getTrackingInfo({
      $,
      trackingNumber: this.trackingNumber,
    });

    $.export("$summary", `Successfully retrieved tracking information for ${this.trackingNumber}`);
    return response;
  },
};
