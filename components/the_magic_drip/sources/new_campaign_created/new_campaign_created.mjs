import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../the_magic_drip.app.mjs";

export default {
  key: "the_magic_drip-new-campaign-created",
  name: "New Campaign Created",
  description: "Emit new event when a campaign is created. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    app,
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
      const lastRunAt = new Date(0).toISOString();
      const newCampaigns = await this.app.pollNewCampaigns(lastRunAt);
      const sortedCampaigns = newCampaigns.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      ).slice(0, 50);

      for (const campaign of sortedCampaigns) {
        this.$emit(
          campaign,
          {
            id: campaign.id || campaign.createdAt,
            summary: `New Campaign: ${campaign.name}`,
            ts: Date.parse(campaign.createdAt),
          },
        );
      }

      const latestCreatedAt = sortedCampaigns.length
        ? sortedCampaigns[0].createdAt
        : lastRunAt;
      await this.db.set("lastRunAt", latestCreatedAt);
    },
    async activate() {
      // No action needed on activate for polling source
    },
    async deactivate() {
      // No action needed on deactivate for polling source
    },
  },
  async run() {
    const lastRunAt = (await this.db.get("lastRunAt")) || new Date(0).toISOString();
    const newCampaigns = await this.app.pollNewCampaigns(lastRunAt);
    const sortedCampaigns = newCampaigns.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    for (const campaign of sortedCampaigns) {
      this.$emit(
        campaign,
        {
          id: campaign.id || campaign.createdAt,
          summary: `New Campaign: ${campaign.name}`,
          ts: Date.parse(campaign.createdAt),
        },
      );
    }

    if (newCampaigns.length) {
      const latestCreatedAt = newCampaigns.reduce((latest, campaign) => {
        return new Date(campaign.createdAt) > new Date(latest)
          ? campaign.createdAt
          : latest;
      }, lastRunAt);
      await this.db.set("lastRunAt", latestCreatedAt);
    }
  },
};
