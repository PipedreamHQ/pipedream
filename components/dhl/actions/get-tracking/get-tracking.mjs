import dhl from "../../dhl.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "dhl-get-tracking",
  name: "Get Tracking Information",
  description: "Get tracking information for shipments. [See the documentation](https://developer.dhl.com/api-reference/shipment-tracking#operations-default-getTrackingShipment)",
  version: "0.0.1",
  type: "action",
  props: {
    dhl,
    trackingNumber: {
      type: "string",
      label: "Tracking Number",
      description: "The tracking number of the shipment to get tracking information for",
    },
    service: {
      type: "string",
      label: "Service",
      description: "The service of the shipment to get tracking information for",
      options: constants.SHIPPING_SERVICES,
      optional: true,
    },
    requesterCountryCode: {
      type: "string",
      label: "Requester Country Code",
      description: "Optional ISO 3166-1 alpha-2 country code represents country of the consumer of the API response.",
      optional: true,
    },
    originCountryCode: {
      type: "string",
      label: "Origin Country Code",
      description: "Optional ISO 3166-1 alpha-2 country code of the shipment origin to further qualify the shipment tracking number (trackingNumber) parameter of the request.",
      optional: true,
    },
    recipientPostalCode: {
      type: "string",
      label: "Requester Postal Code",
      description: "Postal code of the destination address",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "ISO 639-1 2-character language code for the response. This parameter serves as an indication of the client preferences ONLY. Language availability depends on the service used.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of events to be returned in the response. Default: 5",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Offset of the first event to be returned in the response. Default: 0",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dhl.getTracking({
      $,
      params: {
        trackingNumber: this.trackingNumber,
        service: this.service,
        requesterCountryCode: this.requesterCountryCode,
        originCountryCode: this.originCountryCode,
        recipientPostalCode: this.recipientPostalCode,
        language: this.language,
        limit: this.limit,
        offset: this.offset,
      },
    });
    $.export("$summary", `Successfully fetched tracking information for ${this.trackingNumber}`);
    return response;
  },
};
