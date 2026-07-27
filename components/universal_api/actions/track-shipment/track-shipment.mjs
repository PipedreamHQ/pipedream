import app from "../../universal_api.app.mjs";
import { SHIPMENT_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-track-shipment",
  name: "Track Shipment",
  description:
    "Retrieve tracking statuses for a shipment by tracking ID from the Shipment API on Universal API. Provide `serviceId` to pick the carrier when a consumer has multiple active shipment integrations. [See the documentation](https://docs.universalapi.io/reference/track-shipment).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    consumerId: {
      propDefinition: [
        app,
        "consumerId",
      ],
    },
    trackingId: {
      propDefinition: [
        app,
        "trackingId",
      ],
    },
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
      options: SHIPMENT_SERVICE_IDS,
      optional: false,
      description:
        "`x-uapi-service-id` header identifying which carrier to use (required by the API for this endpoint). One of: `postnord`, `fedex`, `posti`, `bring`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.trackShipment({
      $,
      consumerId: this.consumerId,
      trackingId: this.trackingId,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved tracking status for shipment ${this.trackingId}`);
    return response;
  },
};
