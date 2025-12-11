import fedex from "../../fedex.app.mjs";

export default {
  key: "fedex-track-by-tcn",
  name: "Track by TCN",
  description: "Tracks a package by transportation control number. [See the documentation](https://developer.fedex.com/api/en-us/catalog/track/v1/docs.html#operation/f1f9080e8452d9ac903f562a2d2626d0)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fedex,
    value: {
      type: "string",
      label: "Transportation Control Number",
      description: "The transportation control number to track",
    },
    shipDateBegin: {
      propDefinition: [
        fedex,
        "shipDateBegin",
      ],
    },
    shipDateEnd: {
      propDefinition: [
        fedex,
        "shipDateEnd",
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
    const response = await this.fedex.trackByTrackingControlNumber({
      $,
      data: {
        tcnInfo: {
          value: this.value,
          shipDateBegin: this.shipDateBegin,
          shipDateEnd: this.shipDateEnd,
        },
        includeDetailedScans: this.includeDetailedScans,
      },
    });
    $.export("$summary", `Tracking information for ${this.value} retrieved successfully`);
    return response;
  },
};
