import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import {
  CREATE_REMOVE_OPERATION_TYPES,
  KEYWORD_MATCH_TYPES,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import { getAdditionalFields } from "../common/props.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/reference/rpc/v21/SharedCriterionService/MutateSharedCriteria?transport=rest";

export default {
  key: "google_ads-create-or-remove-shared-criteria",
  name: "Create or Remove Shared Criteria",
  description: `Creates or removes criteria from a shared set (e.g., negative keywords). [See the documentation](${docLink})`,
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
      description: "Whether to create or remove a shared criterion.",
      options: CREATE_REMOVE_OPERATION_TYPES,
    },
    sharedCriterionId: {
      propDefinition: [
        googleAds,
        "sharedCriterionId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
      description: "The shared criterion to remove. Required for **Remove** operations.",
      optional: true,
    },
    sharedSetId: {
      propDefinition: [
        googleAds,
        "sharedSetId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
      description: "The shared set to add this criterion to. Required for **Create** operations.",
      optional: true,
    },
    keywordText: {
      type: "string",
      label: "Keyword Text",
      description: "The keyword text to add to the shared set (max 80 characters, max 10 words). Required for keyword criteria.",
      optional: true,
    },
    keywordMatchType: {
      type: "string",
      label: "Keyword Match Type",
      description: "The match type for the keyword. Required for keyword criteria.",
      options: KEYWORD_MATCH_TYPES,
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
      sharedCriterionId,
      sharedSetId,
      keywordText,
      keywordMatchType,
      additionalFields,
    } = this;

    if (operationType === "remove" && !sharedCriterionId) {
      throw new ConfigurationError(
        "**Shared Criterion** is required for Remove operations.",
      );
    }

    if (operationType === "create") {
      if (!sharedSetId) {
        throw new ConfigurationError(
          "**Shared Set** is required for Create operations.",
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
    const sharedSet = sharedSetId
      ? `customers/${customerId}/sharedSets/${sharedSetId}`
      : undefined;

    let operation;

    if (operationType === "remove") {
      operation = {
        remove: sharedCriterionId,
      };
    } else {
      const criterionData = {
        ...(sharedSet && {
          sharedSet,
        }),
        ...(keywordText && keywordMatchType && {
          keyword: {
            text: keywordText,
            matchType: keywordMatchType,
          },
        }),
        ...parseObject(additionalFields),
      };

      operation = {
        create: criterionData,
      };
    }

    const response = await googleAds.mutateSharedCriteria({
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
      `Successfully ${operationType}d shared criterion${id
        ? ` with criterion ID \`${id}\``
        : ""}.`,
    );
    return response;
  },
};
