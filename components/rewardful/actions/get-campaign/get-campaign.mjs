import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-get-campaign",
  name: "Get Campaign",
  description: "Retrieve a single campaign by ID, including its URL, privacy setting, and commission settings. Use **List Campaigns** to find the campaign ID. [See the documentation](https://developers.rewardful.com/rest-api/campaigns/retrieve-campaign)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rewardful,
    campaignId: {
      propDefinition: [
        rewardful,
        "campaignId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.getCampaign({
      $,
      campaignId: this.campaignId,
    });
    $.export("$summary", `Successfully retrieved campaign ${response.name ?? this.campaignId}`);
    return response;
  },
};
