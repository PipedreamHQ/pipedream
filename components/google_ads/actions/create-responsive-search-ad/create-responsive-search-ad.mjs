import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import { AD_GROUP_STATUSES } from "../../common/constants.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/docs/ads/ad-types";

function parseAsset(value) {
  try {
    const parsed = JSON.parse(value);
    if (parsed?.text) return parsed;
  } catch {
    // not JSON, treat as plain text
  }
  return {
    text: value,
  };
}

export default {
  key: "google_ads-create-responsive-search-ad",
  name: "Create Responsive Search Ad",
  description: `Creates a Responsive Search Ad (RSA) in an ad group. RSA copy (headlines, descriptions) cannot be edited in-place after creation — to change ad copy, remove the existing ad and create a new one. URL fields (\`finalUrls\`, \`trackingUrlTemplate\`, etc.) can be updated in-place via the **Create or Update Ad Group Ad** action. [See the documentation](${docLink})`,
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
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
    adGroupId: {
      propDefinition: [
        googleAds,
        "adGroupId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
      description: "The ad group to create this ad in.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The initial status of the ad. Defaults to `ENABLED`.",
      options: AD_GROUP_STATUSES,
      optional: true,
    },
    headlines: {
      type: "string[]",
      label: "Headlines",
      description: "3–15 headline assets. Each value is either plain text (max 30 characters) or a JSON object to pin to a specific slot: `{\"text\": \"Buy Now\", \"pinnedField\": \"HEADLINE_1\"}`. Valid `pinnedField` values: `HEADLINE_1`, `HEADLINE_2`, `HEADLINE_3`.",
    },
    descriptions: {
      type: "string[]",
      label: "Descriptions",
      description: "2–4 description assets. Each value is either plain text (max 90 characters) or a JSON object to pin to a specific slot: `{\"text\": \"Shop today\", \"pinnedField\": \"DESCRIPTION_1\"}`. Valid `pinnedField` values: `DESCRIPTION_1`, `DESCRIPTION_2`.",
    },
    finalUrls: {
      type: "string[]",
      label: "Final URLs",
      description: "The landing page URL(s). At least one is required.",
    },
    finalMobileUrls: {
      type: "string[]",
      label: "Final Mobile URLs",
      description: "The landing page URL(s) for mobile devices.",
      optional: true,
    },
    trackingUrlTemplate: {
      type: "string",
      label: "Tracking URL Template",
      description: "The URL template for constructing a tracking URL.",
      optional: true,
    },
    finalUrlSuffix: {
      type: "string",
      label: "Final URL Suffix",
      description: "The suffix appended to landing page URLs when serving.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      googleAds,
      accountId,
      customerClientId,
      adGroupId,
      status,
      headlines,
      descriptions,
      finalUrls,
      finalMobileUrls,
      trackingUrlTemplate,
      finalUrlSuffix,
    } = this;

    if (!headlines || headlines.length < 3) {
      throw new ConfigurationError(
        "At least 3 **Headlines** are required for a Responsive Search Ad.",
      );
    }
    if (headlines.length > 15) {
      throw new ConfigurationError(
        "A Responsive Search Ad supports a maximum of 15 **Headlines**.",
      );
    }
    if (!descriptions || descriptions.length < 2) {
      throw new ConfigurationError(
        "At least 2 **Descriptions** are required for a Responsive Search Ad.",
      );
    }
    if (descriptions.length > 4) {
      throw new ConfigurationError(
        "A Responsive Search Ad supports a maximum of 4 **Descriptions**.",
      );
    }
    if (!finalUrls || finalUrls.length === 0) {
      throw new ConfigurationError(
        "At least one **Final URL** is required.",
      );
    }

    const customerId = customerClientId ?? accountId;
    const adGroup = `customers/${customerId}/adGroups/${adGroupId}`;

    const operation = {
      create: {
        adGroup,
        ...(status && {
          status,
        }),
        ad: {
          responsiveSearchAd: {
            headlines: headlines.map(parseAsset),
            descriptions: descriptions.map(parseAsset),
          },
          finalUrls,
          ...(finalMobileUrls?.length && {
            finalMobileUrls,
          }),
          ...(trackingUrlTemplate && {
            trackingUrlTemplate,
          }),
          ...(finalUrlSuffix && {
            finalUrlSuffix,
          }),
        },
      },
    };

    const response = await googleAds.mutateAdGroupAd({
      $,
      accountId,
      customerClientId,
      data: {
        operations: [
          operation,
        ],
      },
    });

    const result = response?.results?.[0];
    const id = result?.resourceName?.split("/").pop();

    $.export(
      "$summary",
      `Successfully created responsive search ad${id
        ? ` with ID \`${id}\``
        : ""}.`,
    );
    return response;
  },
};
