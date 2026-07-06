import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import {
  AD_GROUP_STATUSES,
  AD_GROUP_TYPES,
  AD_ROTATION_MODES,
  CAMPAIGN_OPERATION_TYPES,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import { getAdditionalFields } from "../common/props.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/reference/rpc/v21/AdGroupService/MutateAdGroups?transport=rest";

export default {
  key: "google_ads-create-or-update-ad-group",
  name: "Create or Update Ad Group",
  description: `Creates or updates an ad group. [See the documentation](${docLink})`,
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
      description: "Whether to create, update, or remove an ad group.",
      options: CAMPAIGN_OPERATION_TYPES,
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
      description: "The ad group to update or remove. Required for **Update** and **Remove** operations.",
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
      description: "The campaign this ad group belongs to. Required for **Create** operations.",
      optional: true,
    },
    updateMask: {
      type: "string",
      label: "Update Mask",
      description: "Comma-separated list of fields to update (e.g., `name,status`). Required for **Update** operations.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the ad group. Required for **Create** operations.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the ad group. Immutable after creation — only used for **Create** operations.",
      options: AD_GROUP_TYPES,
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the ad group.",
      options: AD_GROUP_STATUSES,
      optional: true,
    },
    cpcBidMicros: {
      type: "integer",
      label: "CPC Bid (Micros)",
      description: "The maximum CPC (cost-per-click) bid in micros (e.g., `1000000` = $1.00).",
      optional: true,
    },
    cpmBidMicros: {
      type: "integer",
      label: "CPM Bid (Micros)",
      description: "The maximum CPM (cost-per-thousand impressions) bid in micros.",
      optional: true,
    },
    cpvBidMicros: {
      type: "integer",
      label: "CPV Bid (Micros)",
      description: "The maximum CPV (cost-per-view) bid in micros.",
      optional: true,
    },
    targetCpaMicros: {
      type: "integer",
      label: "Target CPA (Micros)",
      description: "The target CPA (cost-per-acquisition) in micros.",
      optional: true,
    },
    targetCpmMicros: {
      type: "integer",
      label: "Target CPM (Micros)",
      description: "The target CPM (cost-per-thousand impressions) in micros.",
      optional: true,
    },
    targetRoas: {
      type: "string",
      label: "Target ROAS",
      description: "The target ROAS (return on ad spend) as a decimal (e.g., `3.5` for 350%).",
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
      description: "The suffix used to append query parameters to landing page URLs.",
      optional: true,
    },
    adRotationMode: {
      type: "string",
      label: "Ad Rotation Mode",
      description: "How ads within the ad group are served relative to one another.",
      options: AD_ROTATION_MODES,
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
      adGroupId,
      campaignId,
      updateMask,
      name,
      type,
      status,
      cpcBidMicros,
      cpmBidMicros,
      cpvBidMicros,
      targetCpaMicros,
      targetCpmMicros,
      targetRoas,
      trackingUrlTemplate,
      finalUrlSuffix,
      adRotationMode,
      additionalFields,
    } = this;

    if ((operationType === "update" || operationType === "remove") && !adGroupId) {
      throw new ConfigurationError(
        "**Ad Group** is required for Update and Remove operations.",
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
      if (!campaignId) {
        throw new ConfigurationError(
          "**Campaign** is required for Create operations.",
        );
      }
    }

    const customerId = customerClientId ?? accountId;
    const resourceName = adGroupId
      ? `customers/${customerId}/adGroups/${adGroupId}`
      : undefined;
    const campaign = campaignId
      ? `customers/${customerId}/campaigns/${campaignId}`
      : undefined;

    let parsedTargetRoas;
    if (targetRoas !== undefined) {
      parsedTargetRoas = parseFloat(targetRoas);
      if (!Number.isFinite(parsedTargetRoas)) {
        throw new ConfigurationError(
          `**Target ROAS** must be a valid decimal number (e.g., \`3.5\`), got: \`${targetRoas}\`.`,
        );
      }
    }

    let operation;

    if (operationType === "remove") {
      operation = {
        remove: resourceName,
      };
    } else {
      const adGroupData = {
        ...(resourceName && {
          resourceName,
        }),
        ...(campaign && {
          campaign,
        }),
        ...(name && {
          name,
        }),
        ...(type && {
          type,
        }),
        ...(status && {
          status,
        }),
        ...(cpcBidMicros !== undefined && {
          cpcBidMicros,
        }),
        ...(cpmBidMicros !== undefined && {
          cpmBidMicros,
        }),
        ...(cpvBidMicros !== undefined && {
          cpvBidMicros,
        }),
        ...(targetCpaMicros !== undefined && {
          targetCpaMicros,
        }),
        ...(targetCpmMicros !== undefined && {
          targetCpmMicros,
        }),
        ...(parsedTargetRoas !== undefined && {
          targetRoas: parsedTargetRoas,
        }),
        ...(trackingUrlTemplate && {
          trackingUrlTemplate,
        }),
        ...(finalUrlSuffix && {
          finalUrlSuffix,
        }),
        ...(adRotationMode && {
          adRotationMode,
        }),
        ...parseObject(additionalFields),
      };

      if (operationType === "update") {
        operation = {
          update: adGroupData,
          updateMask,
        };
      } else {
        operation = {
          create: adGroupData,
        };
      }
    }

    const response = await googleAds.mutateAdGroup({
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
      `Successfully ${operationType}d ad group${id
        ? ` with ID \`${id}\``
        : ""}.`,
    );
    return response;
  },
};
