import stannp from "../../stannp.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "stannp-get-campaign",
  name: "Get a Single Campaign",
  description: "Get a single campaign based on the provided campaign ID. [See the documentation](https://www.stannp.com/us/direct-mail-api/campaigns)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    stannp,
    campaignId: {
      propDefinition: [
        stannp,
        "campaignId",
        (c) => ({
          campaignId: c.campaignId,
        }),
      ],
      label: "Campaign ID",
      description: "Select the campaign ID",
      async options() {
        const { data } = await this.stannp.listCampaigns();
        return data.map((campaign) => ({
          label: campaign.name,
          value: campaign.id.toString(),
        }));
      },
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
