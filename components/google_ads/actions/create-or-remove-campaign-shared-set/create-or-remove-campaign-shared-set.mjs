import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import { CREATE_REMOVE_OPERATION_TYPES } from "../../common/constants.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/reference/rpc/v21/CampaignSharedSetService/MutateCampaignSharedSets?transport=rest";

export default {
  key: "google_ads-create-or-remove-campaign-shared-set",
  name: "Create or Remove Campaign Shared Set",
  description: `Attaches or detaches a shared set from a campaign. [See the documentation](${docLink})`,
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
      description: "Whether to attach or detach a shared set from a campaign.",
      options: CREATE_REMOVE_OPERATION_TYPES,
    },
    campaignSharedSetId: {
      propDefinition: [
        googleAds,
        "campaignSharedSetId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
      description: "The campaign shared set to remove. Required for **Remove** operations.",
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
      description: "The campaign to attach the shared set to. Required for **Create** operations.",
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
      description: "The shared set to attach to the campaign. Required for **Create** operations.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      googleAds,
      accountId,
      customerClientId,
      operationType,
      campaignSharedSetId,
      campaignId,
      sharedSetId,
    } = this;

    if (operationType === "remove" && !campaignSharedSetId) {
      throw new ConfigurationError(
        "**Campaign Shared Set** is required for Remove operations.",
      );
    }

    if (operationType === "create") {
      if (!campaignId) {
        throw new ConfigurationError(
          "**Campaign** is required for Create operations.",
        );
      }
      if (!sharedSetId) {
        throw new ConfigurationError(
          "**Shared Set** is required for Create operations.",
        );
      }
    }

    const customerId = customerClientId ?? accountId;

    let operation;

    if (operationType === "remove") {
      operation = {
        remove: campaignSharedSetId,
      };
    } else {
      operation = {
        create: {
          campaign: `customers/${customerId}/campaigns/${campaignId}`,
          sharedSet: `customers/${customerId}/sharedSets/${sharedSetId}`,
        },
      };
    }

    const response = await googleAds.mutateCampaignSharedSets({
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
    const resourceId = result?.resourceName?.split("/").pop();

    $.export(
      "$summary",
      `Successfully ${operationType}d campaign shared set${resourceId
        ? ` \`${resourceId}\``
        : ""}.`,
    );
    return response;
  },
};
