import omnisend from "../../omnisend.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "omnisend-start-campaign",
  name: "Start Campaign",
  description: "Starts a marketing campaign for selected subscribers. [See the documentation](https://api-docs.omnisend.com/reference/post_campaigns-campaignid-actions-start)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    omnisend,
    campaignId: {
      propDefinition: [
        omnisend,
        "campaignId",
        async (options, { page = 0 }) => {
          const { campaigns } = await this.listCampaigns({
            offset: page * 100,
            limit: 100,
          });
          return campaigns.map((campaign) => ({
            label: campaign.name,
            value: campaign.campaignID,
          }));
        },
      ],
    },
  },
  async run({ $ }) {
    const response = await this.omnisend.startCampaign({
      campaignId: this.campaignId,
    });
    $.export("$summary", `Successfully started campaign with ID ${this.campaignId}`);
    return response;
  },
};
