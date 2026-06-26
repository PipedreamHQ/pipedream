import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import {
  CAMPAIGN_STATUSES,
  CREATE_REMOVE_OPERATION_TYPES,
  KEYWORD_MATCH_TYPES,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import { getAdditionalFields } from "../common/props.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/reference/rpc/v21/CampaignCriterionService/MutateCampaignCriteria?transport=rest";

export default {
  key: "google_ads-create-or-remove-campaign-criteria",
  name: "Create or Remove Campaign Criteria",
  description: `Creates or removes criteria for a campaign (e.g., keyword targeting, brand lists). [See the documentation](${docLink})`,
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
      description: "Whether to create or remove a campaign criterion.",
      options: CREATE_REMOVE_OPERATION_TYPES,
    },
    campaignCriterionId: {
      propDefinition: [
        googleAds,
        "campaignCriterionId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
      description: "The campaign criterion to remove. Required for **Remove** operations.",
      optional: true,
    },
    campaignId: {
      propDefinition: [
        googleAds,
        "campaignId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
      description: "The campaign to add this criterion to. Required for **Create** operations.",
      optional: true,
    },
    negative: {
      type: "boolean",
      label: "Negative",
      description: "Whether this is a negative criterion (e.g., a keyword to exclude). Immutable after creation.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the criterion.",
      options: CAMPAIGN_STATUSES,
      optional: true,
    },
    keywordText: {
      type: "string",
      label: "Keyword Text",
      description: "The keyword text for keyword criteria (max 80 characters, max 10 words).",
      optional: true,
    },
    keywordMatchType: {
      type: "string",
      label: "Keyword Match Type",
      description: "The match type for the keyword. Required when **Keyword Text** is provided.",
      options: KEYWORD_MATCH_TYPES,
      optional: true,
    },
    brandListSharedSet: {
      type: "string",
      label: "Brand List Shared Set",
      description: "The resource name of the shared set for brand list criteria (e.g., `customers/123/sharedSets/456`).",
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
      campaignCriterionId,
      campaignId,
      negative,
      status,
      keywordText,
      keywordMatchType,
      brandListSharedSet,
      additionalFields,
    } = this;

    if (operationType === "remove" && !campaignCriterionId) {
      throw new ConfigurationError(
        "**Campaign Criterion** is required for Remove operations.",
      );
    }

    if (operationType === "create") {
      if (!campaignId) {
        throw new ConfigurationError(
          "**Campaign** is required for Create operations.",
        );
      }
      if (keywordText && !keywordMatchType) {
        throw new ConfigurationError(
          "**Keyword Match Type** is required when **Keyword Text** is provided.",
        );
      }
      if (keywordMatchType && !keywordText) {
        throw new ConfigurationError(
          "**Keyword Text** is required when **Keyword Match Type** is provided.",
        );
      }
    }

    const customerId = customerClientId ?? accountId;
    const campaign = campaignId
      ? `customers/${customerId}/campaigns/${campaignId}`
      : undefined;

    let operation;

    if (operationType === "remove") {
      operation = {
        remove: campaignCriterionId,
      };
    } else {
      const criterionData = {
        ...(campaign && {
          campaign,
        }),
        ...(negative !== undefined && {
          negative,
        }),
        ...(status && {
          status,
        }),
        ...(keywordText && keywordMatchType && {
          keyword: {
            text: keywordText,
            matchType: keywordMatchType,
          },
        }),
        ...(brandListSharedSet && {
          brandList: {
            sharedSet: brandListSharedSet,
          },
        }),
        ...parseObject(additionalFields),
      };

      operation = {
        create: criterionData,
      };
    }

    const response = await googleAds.mutateCampaignCriteria({
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
      `Successfully ${operationType}d campaign criterion${id
        ? ` with criterion ID \`${id}\``
        : ""}.`,
    );
    return response;
  },
};
