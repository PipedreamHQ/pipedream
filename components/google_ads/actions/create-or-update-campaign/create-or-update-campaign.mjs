import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import {
  ADVERTISING_CHANNEL_TYPES,
  CAMPAIGN_OPERATION_TYPES,
  CAMPAIGN_STATUSES,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import { getAdditionalFields } from "../common/props.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/reference/rpc/v21/CampaignService/MutateCampaigns?transport=rest";

export default {
  key: "google_ads-create-or-update-campaign",
  name: "Create or Update Campaign",
  description: `Creates or updates a campaign. [See the documentation](${docLink})`,
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
    startDate: {
      type: "string",
      label: "Start Date",
      description:
        "The date when the campaign starts serving ads, formatted as `YYYY-MM-DD`.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description:
        "The last day the campaign serves ads, formatted as `YYYY-MM-DD`. Leave blank for no end date.",
      optional: true,
    },
    trackingUrlTemplate: {
      type: "string",
      label: "Tracking URL Template",
      description: "The URL template for constructing a tracking URL.",
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
      campaignId,
      updateMask,
      name,
      advertisingChannelType,
      campaignBudget,
      status,
      startDate,
      endDate,
      trackingUrlTemplate,
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

    if (operationType === "create") {
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
        ...(startDate && {
          startDate,
        }),
        ...(endDate && {
          endDate,
        }),
        ...(trackingUrlTemplate && {
          trackingUrlTemplate,
        }),
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
