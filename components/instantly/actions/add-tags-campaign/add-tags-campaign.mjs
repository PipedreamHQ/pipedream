import instantly from "../../instantly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "instantly-add-tags-campaign",
  name: "Add Tags to Campaign",
  description: "Adds tags to a specific campaign. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    instantly,
    campaign_id: {
      propDefinition: [
        instantly,
        "campaignId",
      ],
    },
    tags: {
      propDefinition: [
        instantly,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.instantly.addTagsToCampaign({
      campaignId: this.campaign_id,
      tags: this.tags,
    });
    $.export("$summary", `Added tags to campaign ${this.campaign_id}`);
    return response;
  },
};
