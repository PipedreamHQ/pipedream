import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import {
  AD_GROUP_STATUSES,
  CAMPAIGN_OPERATION_TYPES,
  KEYWORD_MATCH_TYPES,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import { getAdditionalFields } from "../common/props.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/reference/rpc/v21/AdGroupCriterionService/MutateAdGroupCriteria?transport=rest";

export default {
  key: "google_ads-create-or-update-keywords",
  name: "Create, Update, or Remove Keywords",
  description: `Creates, updates, or removes keyword criteria for an ad group. [See the documentation](${docLink})`,
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
      description: "Whether to create, update, or remove a keyword.",
      options: CAMPAIGN_OPERATION_TYPES,
    },
    adGroupCriterionId: {
      propDefinition: [
        googleAds,
        "adGroupCriterionId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
      description: "The keyword to update or remove. Required for **Update** and **Remove** operations.",
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
      description: "The ad group this keyword belongs to. Required for **Create** operations.",
      optional: true,
    },
    updateMask: {
      type: "string",
      label: "Update Mask",
      description: "Comma-separated list of fields to update (e.g., `status,cpcBidMicros`). Required for **Update** operations.",
      optional: true,
    },
    keywordText: {
      type: "string",
      label: "Keyword Text",
      description: "The keyword text (max 80 characters, max 10 words). Required for **Create** operations.",
      optional: true,
    },
    keywordMatchType: {
      type: "string",
      label: "Keyword Match Type",
      description: "The match type for the keyword. Required for **Create** operations.",
      options: KEYWORD_MATCH_TYPES,
      optional: true,
    },
    negative: {
      type: "boolean",
      label: "Negative Keyword",
      description: "Whether this is a negative keyword. Immutable after creation.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the keyword criterion.",
      options: AD_GROUP_STATUSES,
      optional: true,
    },
    cpcBidMicros: {
      type: "integer",
      label: "CPC Bid (Micros)",
      description: "The maximum CPC (cost-per-click) bid in micros (e.g., `1000000` = $1.00).",
      optional: true,
    },
    trackingUrlTemplate: {
      type: "string",
      label: "Tracking URL Template",
      description: "The URL template for constructing a tracking URL.",
      optional: true,
    },
    finalUrls: {
      type: "string[]",
      label: "Final URLs",
      description: "The list of final URLs for the keyword.",
      optional: true,
    },
    finalMobileUrls: {
      type: "string[]",
      label: "Final Mobile URLs",
      description: "The list of final mobile URLs for the keyword.",
      optional: true,
    },
    finalUrlSuffix: {
      type: "string",
      label: "Final URL Suffix",
      description: "The suffix used to append query parameters to landing page URLs.",
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
      adGroupCriterionId,
      adGroupId,
      updateMask,
      keywordText,
      keywordMatchType,
      negative,
      status,
      cpcBidMicros,
      trackingUrlTemplate,
      finalUrls,
      finalMobileUrls,
      finalUrlSuffix,
      additionalFields,
    } = this;

    if ((operationType === "update" || operationType === "remove") && !adGroupCriterionId) {
      throw new ConfigurationError(
        "**Keyword** is required for Update and Remove operations.",
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
      if (!keywordText) {
        throw new ConfigurationError(
          "**Keyword Text** is required for Create operations.",
        );
      }
      if (!keywordMatchType) {
        throw new ConfigurationError(
          "**Keyword Match Type** is required for Create operations.",
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
        remove: adGroupCriterionId,
      };
    } else {
      const criterionData = {
        ...(adGroupCriterionId && {
          resourceName: adGroupCriterionId,
        }),
        ...(adGroup && {
          adGroup,
        }),
        ...(keywordText && keywordMatchType && {
          keyword: {
            text: keywordText,
            matchType: keywordMatchType,
          },
        }),
        ...(negative !== undefined && {
          negative,
        }),
        ...(status && {
          status,
        }),
        ...(cpcBidMicros !== undefined && {
          cpcBidMicros,
        }),
        ...(trackingUrlTemplate && {
          trackingUrlTemplate,
        }),
        ...(finalUrls?.length && {
          finalUrls,
        }),
        ...(finalMobileUrls?.length && {
          finalMobileUrls,
        }),
        ...(finalUrlSuffix && {
          finalUrlSuffix,
        }),
        ...parseObject(additionalFields),
      };

      if (operationType === "update") {
        operation = {
          update: criterionData,
          updateMask,
        };
      } else {
        operation = {
          create: criterionData,
        };
      }
    }

    const response = await googleAds.mutateAdGroupCriteria({
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
    const id = result?.resourceName?.split("~").pop();

    $.export(
      "$summary",
      `Successfully ${operationType}d keyword${id
        ? ` with criterion ID \`${id}\``
        : ""}.`,
    );
    return response;
  },
};
