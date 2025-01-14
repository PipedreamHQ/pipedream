import { parseObject } from "../../common/utils.mjs";
import instantly from "../../instantly.app.mjs";

export default {
  key: "instantly-add-lead-campaign",
  name: "Add Lead to Campaign",
  description: "Adds a lead to a campaign for tracking or further actions. [See the documentation](https://developer.instantly.ai/lead/add-leads-to-a-campaign)",
  version: "0.0.1",
  type: "action",
  props: {
    instantly,
    leads: {
      propDefinition: [
        instantly,
        "leads",
      ],
    },
    campaignId: {
      propDefinition: [
        instantly,
        "campaignId",
      ],
    },
    skipIfInWorkspace: {
      type: "boolean",
      label: "Skip if in Workspace",
      description: "Skip lead if it exists in any campaigns in the workspace",
      optional: true,
    },
    skipIfInCampaign: {
      type: "boolean",
      label: "Skip if in Campaign",
      description: "Skip lead if it exists in the campaign",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.instantly.addLeadsToCampaign({
      $,
      data: {
        leads: parseObject(this.leads),
        campaign_id: this.campaignId,
        skip_if_in_workspace: this.skipIfInWorkspace,
        skip_if_in_campaign: this.skipIfInCampaign,
      },
    });
    $.export("$summary", `Added ${response.leads_uploaded} leads to campaign ${this.campaignId}`);
    return response;
  },
};
