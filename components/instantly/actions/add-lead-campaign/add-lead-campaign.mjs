import { parseObject } from "../../common/utils.mjs";
import instantly from "../../instantly.app.mjs";

export default {
  key: "instantly-add-lead-campaign",
  name: "Add Leads to Campaign",
  description: "Adds a lead or leads to a campaign for tracking or further actions. [See the documentation](https://developer.instantly.ai/api/v2/lead/moveleads)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    instantly,
    leadIds: {
      propDefinition: [
        instantly,
        "leadIds",
      ],
    },
    campaignId: {
      propDefinition: [
        instantly,
        "campaignId",
      ],
    },
    skipIfInCampaign: {
      type: "boolean",
      label: "Skip if in Campaign",
      description: "Skip lead if it exists in the campaign",
      optional: true,
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "Set to `true` to poll the API in 3-second intervals until the background job is completed",
      optional: true,
    },
  },
  async run({ $ }) {
    let response = await this.instantly.addLeadsToCampaign({
      $,
      data: {
        ids: parseObject(this.leadIds),
        to_campaign_id: this.campaignId,
        check_duplicates_in_campaigns: this.skipIfInCampaign,
      },
    });

    if (this.waitForCompletion) {
      const jobId = response.id;
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      while (response.status === "pending" || response.status === "in-progress") {
        response = await this.instantly.getBackgroundJob({
          $,
          jobId,
        });
        await timer(3000);
      }
    }

    $.export("$summary", `Added ${this.leadIds.length} lead(s) to campaign ${this.campaignId}`);
    return response;
  },
};
