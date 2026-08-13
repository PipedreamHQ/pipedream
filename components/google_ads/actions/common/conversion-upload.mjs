import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import { getAdditionalFields } from "../common/props.mjs";

export const DOC_LINK =
  "https://developers.google.com/google-ads/api/reference/rpc/v25/ConversionUploadService";

export const DATE_TIME_HINT =
  "Format `YYYY-MM-DD HH:MM:SS+|-HH:MM`, including the UTC offset (e.g. `2026-08-13 12:32:45-08:00`).";

export const commonProps = {
  googleAds,
  accountId: {
    propDefinition: [
      googleAds,
      "accountId",
    ],
  },
  customerClientId: {
    propDefinition: [
      googleAds,
      "customerClientId",
      ({ accountId }) => ({
        accountId,
      }),
    ],
    optional: true,
  },
  conversionActionId: {
    propDefinition: [
      googleAds,
      "conversionActionId",
      ({
        accountId, customerClientId,
      }) => ({
        accountId,
        customerClientId,
      }),
    ],
  },
  conversionDateTime: {
    type: "string",
    label: "Conversion Date Time",
    description: `When the conversion occurred. Must be after the click or call. ${DATE_TIME_HINT}`,
  },
  conversionValue: {
    type: "string",
    label: "Conversion Value",
    description: "The value of the conversion to the advertiser (e.g. `25.50`).",
    optional: true,
  },
  currencyCode: {
    type: "string",
    label: "Currency Code",
    description: "ISO 4217 three-character currency code for the conversion value (e.g. `USD`).",
    optional: true,
  },
  validateOnly: {
    type: "boolean",
    label: "Validate Only",
    description: "If `true`, the upload is validated but not recorded. Useful for checking a payload before sending real data.",
    optional: true,
    default: false,
  },
  additionalFields: getAdditionalFields(DOC_LINK),
};

export function buildBaseConversion({
  conversionActionId, conversionDateTime, conversionValue, currencyCode, additionalFields,
}) {
  if (conversionValue && !currencyCode) {
    throw new ConfigurationError(
      "**Currency Code** is required when **Conversion Value** is set.",
    );
  }
  // A non-numeric value serializes to `null`, which Google accepts as a valueless conversion.
  if (conversionValue && Number.isNaN(Number(conversionValue))) {
    throw new ConfigurationError(
      `**Conversion Value** must be a number, got \`${conversionValue}\`.`,
    );
  }
  return {
    conversionAction: conversionActionId,
    conversionDateTime,
    ...(conversionValue && {
      conversionValue: Number(conversionValue),
    }),
    ...(currencyCode && {
      currencyCode,
    }),
    ...parseObject(additionalFields),
  };
}

// `partialFailure` is required by the API, so a rejected conversion still returns HTTP 200 with
// the reason in `partialFailureError` - without this check a failed upload would report success.
export async function uploadConversion({
  $, googleAds, method, accountId, customerClientId, conversion, validateOnly,
}) {
  const response = await googleAds[method]({
    $,
    accountId,
    customerClientId,
    data: {
      conversions: [
        conversion,
      ],
      partialFailure: true,
      validateOnly,
    },
  });

  const { partialFailureError } = response;
  if (partialFailureError) {
    throw new Error(
      `Google Ads rejected the conversion: ${partialFailureError.message}`,
    );
  }

  return response;
}
