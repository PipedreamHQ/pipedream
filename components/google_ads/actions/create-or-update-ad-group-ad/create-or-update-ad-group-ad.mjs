import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import {
  AD_GROUP_STATUSES, CAMPAIGN_OPERATION_TYPES,
} from "../../common/constants.mjs";
import {
  parseObject, parseStringObject,
} from "../../common/utils.mjs";
import { getAdditionalFields } from "../common/props.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/reference/rpc/v21/AdGroupAdService/MutateAdGroupAds?transport=rest";

export default {
  key: "google_ads-create-or-update-ad-group-ad",
  name: "Create or Update Ad Group Ad",
  description: `Creates or updates an ad group ad. [See the documentation](${docLink})`,
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
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
    operationType: {
      type: "string",
      label: "Operation Type",
      description: "Whether to create, update, or remove an ad group ad.",
      options: CAMPAIGN_OPERATION_TYPES,
    },
    adGroupAdId: {
      propDefinition: [
        googleAds,
        "adGroupAdId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
      description: "The ad to update or remove. Required for **Update** and **Remove** operations.",
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
      description: "The ad group this ad belongs to. Required for **Create** operations.",
      optional: true,
    },
    updateMask: {
      type: "string",
      label: "Update Mask",
      description: "Comma-separated list of fields to update (e.g., `status,ad.finalUrls`). Required for **Update** operations.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the ad group ad.",
      options: AD_GROUP_STATUSES,
      optional: true,
    },
    ad: {
      type: "string",
      label: "Ad",
      description: "JSON object specifying the ad content. Required for **Create** operations. For creates, include the ad `type` and the corresponding type-specific fields (e.g., `responsiveSearchAd`, `expandedTextAd`), along with `finalUrls`. For updates, only include mutable ad fields (e.g., `finalUrls`, `trackingUrlTemplate`, `finalUrlSuffix`).",
      optional: true,
    },
    additionalFields: getAdditionalFields(docLink),
  },
  async run({ $ }) {
    const {
      googleAds,
      accountId,
      customerClientId,
      operationType,
      adGroupAdId,
      adGroupId,
      updateMask,
      status,
      ad,
      additionalFields,
    } = this;

    if ((operationType === "update" || operationType === "remove") && !adGroupAdId) {
      throw new ConfigurationError(
        "**Ad Group Ad** is required for Update and Remove operations.",
      );
    }

    if (operationType === "update" && !updateMask) {
      throw new ConfigurationError(
        "**Update Mask** is required for Update operations.",
      );
    }

    if (operationType === "create") {
      if (!adGroupId) {
        throw new ConfigurationError(
          "**Ad Group** is required for Create operations.",
        );
      }
      if (!ad) {
        throw new ConfigurationError(
          "**Ad** is required for Create operations.",
        );
      }
    }

    const customerId = customerClientId ?? accountId;
    const adGroup = adGroupId
      ? `customers/${customerId}/adGroups/${adGroupId}`
      : undefined;

    let operation;

    if (operationType === "remove") {
      operation = {
        remove: adGroupAdId,
      };
    } else {
      const parsedAd = ad
        ? parseStringObject(ad)
        : undefined;

      const adGroupAdData = {
        ...(adGroupAdId && {
          resourceName: adGroupAdId,
        }),
        ...(adGroup && {
          adGroup,
        }),
        ...(status && {
          status,
        }),
        ...(parsedAd && {
          ad: parsedAd,
        }),
        ...parseObject(additionalFields),
      };

      if (operationType === "update") {
        operation = {
          update: adGroupAdData,
          updateMask,
        };
      } else {
        operation = {
          create: adGroupAdData,
        };
      }
    }

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
      `Successfully ${operationType}d ad group ad${id
        ? ` with ID \`${id}\``
        : ""}.`,
    );
    return response;
  },
};
