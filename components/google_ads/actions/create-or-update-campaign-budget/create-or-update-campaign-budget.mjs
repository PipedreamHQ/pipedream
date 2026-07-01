import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import {
  BUDGET_DELIVERY_METHODS,
  BUDGET_PERIODS,
  CAMPAIGN_OPERATION_TYPES,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import { getAdditionalFields } from "../common/props.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/reference/rpc/v21/CampaignBudgetService/MutateCampaignBudgets?transport=rest";

export default {
  key: "google_ads-create-or-update-campaign-budget",
  name: "Create or Update Campaign Budget",
  description: `Creates, updates, or removes a campaign budget. [See the documentation](${docLink})`,
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
      description: "Whether to create, update, or remove a campaign budget.",
      options: CAMPAIGN_OPERATION_TYPES,
    },
    campaignBudgetId: {
      propDefinition: [
        googleAds,
        "campaignBudgetId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
      description: "The budget to update or remove. Required for **Update** and **Remove** operations.",
      optional: true,
    },
    updateMask: {
      type: "string",
      label: "Update Mask",
      description: "Comma-separated list of fields to update (e.g., `name,amountMicros`). Required for **Update** operations.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the budget. Required for **Create** operations.",
      optional: true,
    },
    amountMicros: {
      type: "string",
      label: "Amount (Micros)",
      description: "The amount of the budget in micros (e.g., `1000000` = $1.00). Required for **Create** operations.",
      optional: true,
    },
    deliveryMethod: {
      type: "string",
      label: "Delivery Method",
      description: "How quickly the budget is spent throughout the day.",
      options: BUDGET_DELIVERY_METHODS,
      optional: true,
    },
    explicitlyShared: {
      type: "boolean",
      label: "Explicitly Shared",
      description: "Whether this budget is explicitly shared across multiple campaigns. Immutable after creation.",
      optional: true,
    },
    period: {
      type: "string",
      label: "Period",
      description: "The period over which to spend the budget. Immutable after creation.",
      options: BUDGET_PERIODS,
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
      campaignBudgetId,
      updateMask,
      name,
      amountMicros,
      deliveryMethod,
      explicitlyShared,
      period,
      additionalFields,
    } = this;

    if ((operationType === "update" || operationType === "remove") && !campaignBudgetId) {
      throw new ConfigurationError(
        "**Campaign Budget** is required for Update and Remove operations.",
      );
    }

    if (operationType === "update" && !updateMask) {
      throw new ConfigurationError(
        "**Update Mask** is required for Update operations.",
      );
    }

    if (operationType === "create") {
      if (!name) {
        throw new ConfigurationError(
          "**Name** is required for Create operations.",
        );
      }
      if (!amountMicros) {
        throw new ConfigurationError(
          "**Amount (Micros)** is required for Create operations.",
        );
      }
    }

    const customerId = customerClientId ?? accountId;
    const resourceName = campaignBudgetId
      ? `customers/${customerId}/campaignBudgets/${campaignBudgetId}`
      : undefined;

    let operation;

    if (operationType === "remove") {
      operation = {
        remove: resourceName,
      };
    } else {
      const budgetData = {
        ...(resourceName && {
          resourceName,
        }),
        ...(name && {
          name,
        }),
        ...(amountMicros && {
          amountMicros,
        }),
        ...(deliveryMethod && {
          deliveryMethod,
        }),
        ...(explicitlyShared !== undefined && {
          explicitlyShared,
        }),
        ...(period && {
          period,
        }),
        ...parseObject(additionalFields),
      };

      if (operationType === "update") {
        operation = {
          update: budgetData,
          updateMask,
        };
      } else {
        operation = {
          create: budgetData,
        };
      }
    }

    const response = await googleAds.mutateCampaignBudgets({
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
      `Successfully ${operationType}d campaign budget${id
        ? ` with ID \`${id}\``
        : ""}.`,
    );
    return response;
  },
};
