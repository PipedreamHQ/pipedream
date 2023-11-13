import nexweave from "../../nexweave.app.mjs";

export default {
  key: "nexweave-create-campaign-experience",
  name: "Create Campaign Experience",
  description: "Generates a campaign experience based on a selected campaign. [See the documentation](https://documentation.nexweave.com/nexweave-api)",
  version: "0.0.1",
  type: "action",
  props: {
    nexweave,
    campaignId: {
      propDefinition: [
        nexweave,
        "campaignId",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const { campaignId } = this;
    if (!campaignId) return {};

    const campaignDetails = await this.nexweave.getCampaignDetails(campaignId);
    return Object.fromEntries(campaignDetails?.result?.variables?.map?.((variable) => ([
      variable.key,
      {
        type: "string",
        label: `Variable: "${variable.key}"`,
        description: `Default value: "${variable.default}"`,
        optional: true,
      },
    ])) ?? {});
  },
  async run({ $ }) {
    const {
      nexweave, campaignId, ...data
    } = this;

    const response = await nexweave.createCampaignExperience({
      $,
      data: {
        campaign_id: campaignId,
        data,
      },
    });

    $.export("$summary", "Successfully created campaign experience");
    return response;
  },
};
