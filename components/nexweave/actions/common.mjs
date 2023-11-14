import nexweave from "../nexweave.app.mjs";

export default {
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
    const { // eslint-disable-next-line no-unused-vars
      nexweave, campaignId, ...data
    } = this;

    const response = await this.createExperience({
      $,
      data: {
        campaign_id: campaignId,
        data,
      },
    });

    $.export("$summary", this.getSummary());
    return response;
  },
};
