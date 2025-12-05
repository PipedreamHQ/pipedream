import fedex from "../../fedex.app.mjs";

export default {
  key: "fedex-track-multi-piece-shipment",
  name: "Track Multi-Piece Shipment",
  description: "Tracks a multi-piece shipment. [See the documentation](https://developer.fedex.com/api/en-us/catalog/track/v1/docs.html#operation/Track%20Multiple%20Piece%20Shipment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fedex,
    associatedType: {
      type: "string",
      label: "Associated Type",
      description: "The associated shipment type, such as MPS, Group MPS, or an outbound shipment which is linked to a return shipment",
      options: [
        "OUTBOUND_LINK_TO_RETURN",
        "STANDARD_MPS",
        "GROUP_MPS",
      ],
    },
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
    const response = await this.fedex.trackMultiplePieceShipment({
      $,
      data: {
        associatedType: this.associatedType,
        masterTrackingNumberInfo: {
          trackingNumberInfo: {
            trackingNumber: this.trackingNumber,
          },
        },
        includeDetailedScans: this.includeDetailedScans,
      },
    });
    $.export("$summary", `Tracking information for ${this.trackingNumber} retrieved successfully`);
    return response;
  },
};
