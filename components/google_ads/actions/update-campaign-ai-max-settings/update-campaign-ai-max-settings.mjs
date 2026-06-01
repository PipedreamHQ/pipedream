import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import { ASSET_AUTOMATION_STATUSES } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import { getAdditionalFields } from "../common/props.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/docs/campaigns/ai-max-for-search-campaigns/getting-started";

export default {
  key: "google_ads-update-campaign-ai-max-settings",
  name: "Update Campaign AI Max Settings",
  description: `Enables or configures AI Max for Search settings on a campaign. Only supported on Search campaigns. Toggling AI Max while simultaneously editing brand or text customization settings on the same campaign may fail — update them separately. Ad group-level search term matching is controlled via the **Create or Update Ad Group** action. [See the documentation](${docLink})`,
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
    },
    enableAiMax: {
      type: "boolean",
      label: "Enable AI Max",
      description: "Whether to enable AI Max for Search on this campaign (`aiMaxSetting.enableAiMax`).",
      optional: true,
    },
    bundlingRequired: {
      type: "boolean",
      label: "Bundling Required",
      description: "Whether bundling is required for AI Max asset serving (`aiMaxSetting.bundlingRequired`).",
      optional: true,
    },
    textAssetAutomation: {
      type: "string",
      label: "Text Asset Automation",
      description: "Opt in or out of automatically generated text assets (`TEXT_ASSET_AUTOMATION`).",
      options: ASSET_AUTOMATION_STATUSES,
      optional: true,
    },
    finalUrlExpansionAutomation: {
      type: "string",
      label: "Final URL Expansion Automation",
      description: "Opt in or out of automatically expanding final URLs (`FINAL_URL_EXPANSION_TEXT_ASSET_AUTOMATION`).",
      options: ASSET_AUTOMATION_STATUSES,
      optional: true,
    },
    additionalFields: getAdditionalFields(docLink),
  },
  async run({ $ }) {
    const {
      googleAds,
      accountId,
      customerClientId,
      campaignId,
      enableAiMax,
      bundlingRequired,
      textAssetAutomation,
      finalUrlExpansionAutomation,
      additionalFields,
    } = this;

    const updateMaskFields = [];
    const aiMaxSetting = {};

    if (enableAiMax !== undefined) {
      aiMaxSetting.enableAiMax = enableAiMax;
      updateMaskFields.push("aiMaxSetting.enableAiMax");
    }
    if (bundlingRequired !== undefined) {
      aiMaxSetting.bundlingRequired = bundlingRequired;
      updateMaskFields.push("aiMaxSetting.bundlingRequired");
    }

    const assetAutomationSettings = [];
    if (textAssetAutomation) {
      assetAutomationSettings.push({
        assetAutomationType: "TEXT_ASSET_AUTOMATION",
        assetAutomationStatus: textAssetAutomation,
      });
    }
    if (finalUrlExpansionAutomation) {
      assetAutomationSettings.push({
        assetAutomationType: "FINAL_URL_EXPANSION_TEXT_ASSET_AUTOMATION",
        assetAutomationStatus: finalUrlExpansionAutomation,
      });
    }
    if (assetAutomationSettings.length) {
      updateMaskFields.push("assetAutomationSettings");
    }

    const extraFields = parseObject(additionalFields);
    const extraKeys = Object.keys(extraFields);
    if (extraKeys.length) {
      updateMaskFields.push(...extraKeys);
    }

    if (!updateMaskFields.length) {
      throw new ConfigurationError(
        "At least one AI Max setting must be provided.",
      );
    }

    const customerId = customerClientId ?? accountId;
    const resourceName = `customers/${customerId}/campaigns/${campaignId}`;

    const campaignData = {
      resourceName,
      ...(Object.keys(aiMaxSetting).length && {
        aiMaxSetting,
      }),
      ...(assetAutomationSettings.length && {
        assetAutomationSettings,
      }),
      ...extraFields,
    };

    const response = await googleAds.mutateCampaign({
      $,
      accountId,
      customerClientId,
      data: {
        operations: [
          {
            update: campaignData,
            updateMask: updateMaskFields.join(","),
          },
        ],
      },
    });

    $.export(
      "$summary",
      `Successfully updated AI Max settings for campaign \`${campaignId}\`.`,
    );
    return response;
  },
};
