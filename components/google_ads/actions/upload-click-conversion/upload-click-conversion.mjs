import { ConfigurationError } from "@pipedream/platform";
import { CONVERSION_ENVIRONMENTS } from "../../common/constants.mjs";
import {
  buildBaseConversion, commonProps, DOC_LINK, uploadConversion,
} from "../common/conversion-upload.mjs";

const docLink = `${DOC_LINK}/UploadClickConversions?transport=rest`;

export default {
  key: "google_ads-upload-click-conversion",
  name: "Upload Click Conversion",
  description: `Uploads an offline conversion attributed to an ad click. Requires a conversion action of type **Upload Clicks**. [See the documentation](${docLink})`,
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...commonProps,
    gclid: {
      type: "string",
      label: "GCLID",
      description: "The Google click ID from the ad click that led to this conversion. Provide this, **GBRAID**, or **WBRAID**.",
      optional: true,
    },
    gbraid: {
      type: "string",
      label: "GBRAID",
      description: "The click identifier for iOS app-to-web conversions. Provide this, **GCLID**, or **WBRAID**.",
      optional: true,
    },
    wbraid: {
      type: "string",
      label: "WBRAID",
      description: "The click identifier for iOS web-to-web conversions. Provide this, **GCLID**, or **GBRAID**.",
      optional: true,
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "Transaction ID for this conversion. An order ID can only be used once per conversion action.",
      optional: true,
    },
    conversionEnvironment: {
      type: "string",
      label: "Conversion Environment",
      description: "Where the conversion was recorded.",
      options: CONVERSION_ENVIRONMENTS,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      googleAds,
      accountId,
      customerClientId,
      gclid,
      gbraid,
      wbraid,
      orderId,
      conversionEnvironment,
      validateOnly,
    } = this;

    // Google rejects two identifiers with `GBRAID_WBRAID_BOTH_SET`.
    const identifiers = [
      gclid,
      gbraid,
      wbraid,
    ].filter(Boolean);
    if (!identifiers.length) {
      throw new ConfigurationError(
        "One of **GCLID**, **GBRAID**, or **WBRAID** is required to attribute a click conversion.",
      );
    }
    if (identifiers.length > 1) {
      throw new ConfigurationError(
        "Set only one of **GCLID**, **GBRAID**, or **WBRAID** - each click has a single identifier.",
      );
    }

    const conversion = {
      ...buildBaseConversion(this),
      ...(gclid && {
        gclid,
      }),
      ...(gbraid && {
        gbraid,
      }),
      ...(wbraid && {
        wbraid,
      }),
      ...(orderId && {
        orderId,
      }),
      ...(conversionEnvironment && {
        conversionEnvironment,
      }),
    };

    const response = await uploadConversion({
      $,
      googleAds,
      method: "uploadClickConversions",
      accountId,
      customerClientId,
      conversion,
      validateOnly,
    });

    $.export(
      "$summary",
      validateOnly
        ? "Click conversion payload validated successfully (not recorded)."
        : "Successfully uploaded click conversion.",
    );
    return response;
  },
};
