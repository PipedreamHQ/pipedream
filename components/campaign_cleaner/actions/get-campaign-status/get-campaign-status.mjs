import campaignCleaner from "../../campaign_cleaner.app.mjs";

export default {
  key: "campaign_cleaner-get-campaign-status",
  name: "Get Campaign Status",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Check the status of your campaign. [See the documentation](https://api-docs.campaigncleaner.com/#6f4578f7-60f9-4fb6-9b61-08b176f66d82)",
  type: "action",
  props: {
    campaignCleaner,
    campaignId: {
      propDefinition: [
        campaignCleaner,
        "campaignId",
      ],
    },
  },
  async run({ $ }) {
    const {
      campaignCleaner,
      campaignId,
    } = this;

    const response = await campaignCleaner.getCampaignStatus({
      $,
      data: {
        campaign: {
          id: campaignId,
        },
      },
    });

    if (response.Error) throw new Error(response.Error);

    $.export("$summary", `The status of the campaign with Id: ${campaignId} was successfully fetched!`);
    return response;
  },
};
