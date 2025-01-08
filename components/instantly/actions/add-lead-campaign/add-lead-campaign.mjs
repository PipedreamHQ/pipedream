import instantly from "../../instantly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "instantly-add-lead-campaign",
  name: "Add Lead to Campaign",
  description: "Adds a lead to a campaign for tracking or further actions. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    instantly,
    leads: {
      propDefinition: [
        "instantly",
        "leads",
      ],
    },
    campaign_id: {
      propDefinition: [
        "instantly",
        "campaignId",
      ],
    },
    skip_if_in_workspace: {
      type: "boolean",
      label: "Skip if in Workspace",
      description: "Skip lead if it exists in any campaigns in the workspace",
      optional: true,
    },
    skip_if_in_campaign: {
      type: "boolean",
      label: "Skip if in Campaign",
      description: "Skip lead if it exists in the campaign",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.instantly.addLeadsToCampaign({
      leads: this.leads,
      campaignId: this.campaign_id,
      skipIfInWorkspace: this.skip_if_in_workspace,
      skipIfInCampaign: this.skip_if_in_campaign,
    });
    $.export("$summary", `Added ${response.leads_uploaded} leads to campaign ${this.campaign_id}`);
    return response;
  },
};
