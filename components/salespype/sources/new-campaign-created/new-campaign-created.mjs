import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import salespype from "../../salespype.app.mjs";

export default {
  key: "salespype-new-campaign-created",
  name: "New Campaign Created",
  description: "Emit new events when a new campaign is created. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    salespype,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch the latest 50 campaigns and store their IDs to prevent emitting old events
      const campaigns = await this.salespype._makeRequest({
        method: "GET",
        path: "/campaigns",
      });
      const sortedCampaigns = campaigns.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
      const recentCampaigns = sortedCampaigns.slice(0, 50);
      const campaignIds = recentCampaigns.map((campaign) => campaign.id);
      await this.db.set("campaignIds", campaignIds);
    },
    async activate() {
      // No webhook to activate
    },
    async deactivate() {
      // No webhook to deactivate
    },
  },
  async run() {
    // Fetch all campaigns
    const campaigns = await this.salespype._makeRequest({
      method: "GET",
      path: "/campaigns",
    });

    // Sort campaigns by creation date descending
    const sortedCampaigns = campaigns.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );

    // Get the stored campaign IDs
    const storedCampaignIds = (await this.db.get("campaignIds")) || [];

    // Find new campaigns that are not in the storedCampaignIds
    const newCampaigns = sortedCampaigns.filter(
      (campaign) => !storedCampaignIds.includes(campaign.id),
    );

    // Emit each new campaign
    for (const campaign of newCampaigns) {
      this.$emit(
        campaign,
        {
          id: campaign.id,
          summary: `New Campaign: ${campaign.name}`,
          ts: new Date(campaign.created_at).getTime(),
        },
      );
    }

    // Update the stored campaign IDs with the latest 50
    const latestCampaignIds = sortedCampaigns.slice(0, 50).map((campaign) => campaign.id);
    await this.db.set("campaignIds", latestCampaignIds);
  },
};
