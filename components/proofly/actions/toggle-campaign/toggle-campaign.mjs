import proofly from "../../proofly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "proofly-toggle-campaign",
  name: "Toggle Campaign Status",
  description: "Switch a campaign's status between active and inactive. [See the documentation](https://proofly.io/developers)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    proofly,
    campaignId: {
      propDefinition: [
        proofly,
        "campaignId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.proofly.switchCampaignStatus({
      campaignId: this.campaignId,
    });

    $.export("$summary", `Toggled campaign status for campaign ID ${this.campaignId}`);
    return response;
  },
};
