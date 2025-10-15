import common from "../common.mjs";
import nexweave from "../../nexweave.app.mjs";

export default {
  key: "nexweave-create-campaign-experience",
  name: "Create Campaign Experience",
  description: "Generates a campaign experience based on a selected campaign. [See the documentation](https://documentation.nexweave.com/nexweave-api#tH7ID)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ...common,
  props: {
    nexweave,
    campaignId: {
      propDefinition: [
        nexweave,
        "campaignId",
      ],
    },
  },
  methods: {
    getSummary() {
      return "Successfully created campaign experience";
    },
    async getItemDetails() {
      return this.nexweave.getCampaignDetails(this.campaignId);
    },
    getData() {
      const { // eslint-disable-next-line no-unused-vars
        nexweave, campaignId, ...data
      } = this;

      return {
        campaign_id: campaignId,
        data,
      };
    },
  },
};
