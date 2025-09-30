import stannp from "../../stannp.app.mjs";

export default {
  key: "stannp-get-campaign",
  name: "Get a Single Campaign",
  description: "Get a single campaign based on the provided campaign ID. [See the documentation](https://www.stannp.com/us/direct-mail-api/campaigns)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    stannp,
    campaignId: {
      propDefinition: [
        stannp,
        "campaignId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.stannp.getCampaign({
      campaignId: this.campaignId,
    });

    $.export("$summary", `Retrieved campaign details for ID ${this.campaignId}`);
    return response;
  },
};
