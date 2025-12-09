import fedex from "../../fedex.app.mjs";

export default {
  key: "fedex-track-by-tracking-number",
  name: "Track by Tracking Number",
  description: "Tracks a package by tracking number. [See the documentation](https://developer.fedex.com/api/en-us/catalog/track/v1/docs.html#operation/Track%20by%20Tracking%20Number)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fedex,
    trackingNumber: {
      propDefinition: [
        fedex,
        "trackingNumber",
      ],
    },
    includeDetailedScans: {
      propDefinition: [
        fedex,
        "includeDetailedScans",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fedex.trackByTrackingNumber({
      $,
      data: {
        trackingInfo: [
          {
            trackingNumberInfo: {
              trackingNumber: this.trackingNumber,
            },
          },
        ],
        includeDetailedScans: this.includeDetailedScans,
      },
    });
    $.export("$summary", `Tracking information for ${this.trackingNumber} retrieved successfully`);
    return response;
  },
};
