import app from "../../universal_api.app.mjs";
import { SHIPMENT_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-track-shipment",
  name: "Track Shipment",
  description:
    "Retrieve tracking statuses for a shipment by tracking ID from the Shipment API on Universal API. Provide `serviceId` to restrict to specific carriers; defaults to `postnord,fedex,posti,bring`. [See the documentation](https://docs.universalapi.io/reference/track-shipment).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
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
      description:
        "Optional `x-uapi-service-id` header selecting carriers. Comma-separated values from `postnord`, `fedex`, `posti`, `bring`. Defaults to `postnord,fedex,posti,bring`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.trackShipment({
      $,
      trackingId: this.trackingId,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved tracking status for shipment ${this.trackingId}`);
    return response;
  },
};
