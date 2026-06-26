import { ConfigurationError } from "@pipedream/platform";
import app from "../../dpd_shipping.app.mjs";

export default {
  key: "dpd_shipping-get-tracking-data",
  name: "Get Tracking Data",
  description: "Track the current status and history of individual parcels during transit and after delivery. Provide the 14-character parcel label number to look up. [See the documentation](https://integrations.dpd.nl/dpd-shipper/dpd-shipper-webservices-rest-api/parcellifecycle-service-rest-api/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    parcelLabelNumber: {
      type: "string",
      label: "Parcel Label Number",
      description: "The DPD parcel label number to track. Free-form string, exactly 14 characters (e.g. `01234567890123`).",
    },
    messageLanguage: {
      type: "string",
      label: "Message Language",
      description: "Language for response messages as a 5-character locale code (e.g. `nl_NL` or `en_US`). Defaults to `en_US` if omitted.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.parcelLabelNumber.length !== 14) {
      throw new ConfigurationError(`Parcel label number must be exactly 14 characters (received ${this.parcelLabelNumber.length}).`);
    }

    const result = await this.app.getTrackingData({
      $,
      messageLanguage: this.messageLanguage,
      parcelLabelNumber: this.parcelLabelNumber,
    });

    const statusInfo = result.getTrackingDataResponse?.trackingResult?.statusInfo;
    const currentStatus = statusInfo?.find((status) => status.isCurrentStatus)?.status ?? "unknown";
    $.export("$summary", `Retrieved tracking data for parcel ${this.parcelLabelNumber}: status ${currentStatus}`);
    return result;
  },
};
