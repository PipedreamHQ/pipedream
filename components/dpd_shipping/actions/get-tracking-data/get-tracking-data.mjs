import { ConfigurationError } from "@pipedream/platform";
import app from "../../dpd_shipping.app.mjs";
import constants from "../../common/constants.mjs";

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
    useTestEnvironment: {
      type: "boolean",
      label: "Use Test Environment",
      description: "Send the request to the DPD staging environment (`wsshippertest.dpd.nl`) instead of production (`wsshipper.dpd.nl`). Defaults to `false` (production).",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    if (this.parcelLabelNumber.length !== 14) {
      throw new ConfigurationError(`Parcel label number must be exactly 14 characters (received ${this.parcelLabelNumber.length}).`);
    }

    const messageLanguage = this.messageLanguage ?? constants.DEFAULT_MESSAGE_LANGUAGE;
    const useTestEnvironment = this.useTestEnvironment;

    // DPD's authToken is valid for 24h and the API forbids refreshing it on
    // every request. We mint it once per invocation here (one login + one
    // tracking call) rather than per request. A stateless action has no store
    // to cache the token across invocations, and a module-level cache would
    // leak tokens across connected accounts, so re-deriving per run is the
    // correct trade-off for this read-only lookup.
    const { getAuthResponse } = await this.app.getAuth({
      $,
      messageLanguage,
      useTestEnvironment,
    });
    const authToken = getAuthResponse?.return?.authToken;
    if (!authToken) {
      throw new Error("DPD authentication response did not include an authToken.");
    }

    const result = await this.app.getTrackingData({
      $,
      authToken,
      messageLanguage,
      parcelLabelNumber: this.parcelLabelNumber,
      useTestEnvironment,
    });

    const statusInfo = result.getTrackingDataResponse?.trackingResult?.statusInfo;
    const currentStatus = statusInfo?.find((status) => status.isCurrentStatus)?.status ?? "unknown";
    $.export("$summary", `Retrieved tracking data for parcel ${this.parcelLabelNumber}: status ${currentStatus}`);
    return result;
  },
};
