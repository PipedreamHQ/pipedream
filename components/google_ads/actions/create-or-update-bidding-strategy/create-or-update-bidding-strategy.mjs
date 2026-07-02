import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import {
  CAMPAIGN_OPERATION_TYPES,
  PORTFOLIO_BIDDING_STRATEGY_TYPES,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import { getAdditionalFields } from "../common/props.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/reference/rpc/v21/BiddingStrategyService/MutateBiddingStrategies?transport=rest";

export default {
  key: "google_ads-create-or-update-bidding-strategy",
  name: "Create or Update Bidding Strategy",
  description: `Creates, updates, or removes a portfolio bidding strategy. [See the documentation](${docLink})`,
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
      description: "Whether to create, update, or remove a bidding strategy.",
      options: CAMPAIGN_OPERATION_TYPES,
    },
    biddingStrategyId: {
      propDefinition: [
        googleAds,
        "biddingStrategyId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
      description: "The bidding strategy to update or remove. Required for **Update** and **Remove** operations.",
      optional: true,
    },
    updateMask: {
      type: "string",
      label: "Update Mask",
      description: "Comma-separated list of fields to update (e.g., `name`). Required for **Update** operations.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the bidding strategy. Required for **Create** operations.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the bidding strategy. Required for **Create** operations. Immutable after creation.",
      options: PORTFOLIO_BIDDING_STRATEGY_TYPES,
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
      biddingStrategyId,
      updateMask,
      name,
      type,
      additionalFields,
    } = this;

    if ((operationType === "update" || operationType === "remove") && !biddingStrategyId) {
      throw new ConfigurationError(
        "**Bidding Strategy** is required for Update and Remove operations.",
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
      if (!type) {
        throw new ConfigurationError(
          "**Type** is required for Create operations.",
        );
      }
    }

    const customerId = customerClientId ?? accountId;
    const resourceName = biddingStrategyId
      ? `customers/${customerId}/biddingStrategies/${biddingStrategyId}`
      : undefined;

    let operation;

    if (operationType === "remove") {
      operation = {
        remove: resourceName,
      };
    } else {
      const strategyData = {
        ...(resourceName && {
          resourceName,
        }),
        ...(name && {
          name,
        }),
        ...(type && {
          type,
        }),
        ...parseObject(additionalFields),
      };

      if (operationType === "update") {
        operation = {
          update: strategyData,
          updateMask,
        };
      } else {
        operation = {
          create: strategyData,
        };
      }
    }

    const response = await googleAds.mutateBiddingStrategies({
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
      `Successfully ${operationType}d bidding strategy${id
        ? ` with ID \`${id}\``
        : ""}.`,
    );
    return response;
  },
};
