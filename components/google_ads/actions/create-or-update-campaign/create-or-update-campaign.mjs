import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import {
  ADVERTISING_CHANNEL_TYPES,
  CAMPAIGN_BIDDING_STRATEGY_TYPES,
  CAMPAIGN_OPERATION_TYPES,
  CAMPAIGN_STATUSES,
  EU_POLITICAL_ADVERTISING_STATUSES,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import { getAdditionalFields } from "../common/props.mjs";
import {
  buildBiddingScheme, CAMPAIGN_BIDDING_SCHEMES, getSchemeProps,
} from "../common/bidding.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/reference/rpc/v25/CampaignService/MutateCampaigns?transport=rest";

export default {
  key: "google_ads-create-or-update-campaign",
  name: "Create or Update Campaign",
  description: `Creates or updates a campaign. [See the documentation](${docLink})`,
  version: "1.0.0",
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
      description: "Whether to create, update, or remove a campaign.",
      options: CAMPAIGN_OPERATION_TYPES,
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
      description: "The campaign to update or remove. Required for **Update** and **Remove** operations.",
      optional: true,
    },
    updateMask: {
      type: "string",
      label: "Update Mask",
      description:
        "Comma-separated list of fields to update (e.g., `name,status`). Only used for **update** operations.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description:
        "The name of the campaign. Required for **create** operations.",
      optional: true,
    },
    advertisingChannelType: {
      type: "string",
      label: "Advertising Channel Type",
      description:
        "The primary serving target for ads within the campaign. Required for **create** operations.",
      options: ADVERTISING_CHANNEL_TYPES,
      optional: true,
    },
    campaignBudget: {
      type: "string",
      label: "Campaign Budget",
      description:
        "The resource name of the campaign budget (e.g., `customers/{customer_id}/campaignBudgets/{budget_id}`). Required for **create** operations.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the campaign.",
      options: CAMPAIGN_STATUSES,
      optional: true,
    },
    startDateTime: {
      type: "string",
      label: "Start Date Time",
      description:
        "When the campaign starts serving ads, in the account's time zone, formatted as `YYYY-MM-DD HH:MM:SS` (use `00:00:00` for daily granularity).",
      optional: true,
    },
    endDateTime: {
      type: "string",
      label: "End Date Time",
      description:
        "The last day and time the campaign serves ads, in the account's time zone, formatted as `YYYY-MM-DD HH:MM:SS` (use `23:59:59` for daily granularity). Leave blank to run indefinitely.",
      optional: true,
    },
    trackingUrlTemplate: {
      type: "string",
      label: "Tracking URL Template",
      description: "The URL template for constructing a tracking URL.",
      optional: true,
    },
    containsEuPoliticalAdvertising: {
      type: "string",
      label: "Contains EU Political Advertising",
      description: "Declares whether the campaign contains EU political advertising. Google requires this on **create**.",
      options: EU_POLITICAL_ADVERTISING_STATUSES,
      optional: true,
    },
    biddingStrategy: {
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
      label: "Portfolio Bidding Strategy",
      description: "An existing portfolio bidding strategy to attach. Leave blank to use a standard (campaign-level) strategy instead.",
      optional: true,
    },
    biddingStrategyType: {
      type: "string",
      label: "Standard Bidding Strategy",
      description: "The campaign-level bidding strategy. Google requires either this or a **Portfolio Bidding Strategy** on **create**.",
      options: CAMPAIGN_BIDDING_STRATEGY_TYPES,
      optional: true,
    },
    ...getSchemeProps(CAMPAIGN_BIDDING_SCHEMES),
    additionalFields: getAdditionalFields(docLink),
  },
  async run({ $ }) {
    const {
      googleAds,
      accountId,
      customerClientId,
      operationType,
      campaignId,
      updateMask,
      name,
      advertisingChannelType,
      campaignBudget,
      status,
      startDateTime,
      endDateTime,
      trackingUrlTemplate,
      containsEuPoliticalAdvertising,
      biddingStrategy,
      biddingStrategyType,
      additionalFields,
    } = this;

    if ((operationType === "update" || operationType === "remove") && !campaignId) {
      throw new ConfigurationError(
        "**Campaign** is required for Update and Remove operations.",
      );
    }

    if (operationType === "update" && !updateMask) {
      throw new ConfigurationError(
        "**Update Mask** is required for Update operations.",
      );
    }

    // `campaign_bidding_strategy` is a union field.
    if (biddingStrategy && biddingStrategyType) {
      throw new ConfigurationError(
        "Set either **Portfolio Bidding Strategy** or **Standard Bidding Strategy**, not both.",
      );
    }

    if (operationType === "create") {
      if (!containsEuPoliticalAdvertising) {
        throw new ConfigurationError(
          "**Contains EU Political Advertising** is required for Create operations.",
        );
      }
      if (!name) {
        throw new ConfigurationError(
          "**Name** is required for Create operations.",
        );
      }
      if (!advertisingChannelType) {
        throw new ConfigurationError(
          "**Advertising Channel Type** is required for Create operations.",
        );
      }
      if (!campaignBudget) {
        throw new ConfigurationError(
          "**Campaign Budget** is required for Create operations.",
        );
      }
    }

    const customerId = customerClientId ?? accountId;
    const resourceName = campaignId
      ? `customers/${customerId}/campaigns/${campaignId}`
      : undefined;

    let operation;

    if (operationType === "remove") {
      operation = {
        remove: resourceName,
      };
    } else {
      const campaignData = {
        ...(resourceName && {
          resourceName,
        }),
        ...(name && {
          name,
        }),
        ...(advertisingChannelType && {
          advertisingChannelType,
        }),
        ...(campaignBudget && {
          campaignBudget,
        }),
        ...(status && {
          status,
        }),
        ...(startDateTime && {
          startDateTime,
        }),
        ...(endDateTime && {
          endDateTime,
        }),
        ...(trackingUrlTemplate && {
          trackingUrlTemplate,
        }),
        ...(containsEuPoliticalAdvertising && {
          containsEuPoliticalAdvertising,
        }),
        ...(biddingStrategy && {
          biddingStrategy: `customers/${customerId}/biddingStrategies/${biddingStrategy}`,
        }),
        ...buildBiddingScheme(CAMPAIGN_BIDDING_SCHEMES, biddingStrategyType, this),
        ...parseObject(additionalFields),
      };

      if (operationType === "update") {
        operation = {
          update: campaignData,
          updateMask,
        };
      } else {
        operation = {
          create: campaignData,
        };
      }
    }

    const response = await googleAds.mutateCampaign({
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
      `Successfully ${operationType}d campaign${id
        ? ` with ID \`${id}\``
        : ""}.`,
    );
    return response;
  },
};
