import campaignMonitor from "../../campaign_monitor.app.mjs";

export default {
  key: "campaign_monitor-new-bounce",
  name: "New Bounce",
  description: "Emits an event when a campaign email bounces",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    campaignMonitor: {
      type: "app",
      app: "campaign_monitor",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    campaignId: {
      propDefinition: [
        campaignMonitor,
        "campaignId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Get the most recent bounces to initialize the checkpoint.
      const bounces = await this.campaignMonitor.emitCampaignEmailBounce(this.campaignId);
      if (bounces && bounces.length > 0) {
        this.db.set("lastBounceDate", bounces[0].Date);
      }
    },
  },
  async run() {
    const lastBounceDate = this.db.get("lastBounceDate");
    const bounces = await this.campaignMonitor.emitCampaignEmailBounce(this.campaignId);

    for (const bounce of bounces) {
      if (!lastBounceDate || new Date(bounce.Date) > new Date(lastBounceDate)) {
        this.$emit(bounce, {
          id: bounce.EmailAddress,
          summary: `New bounce for ${bounce.EmailAddress}`,
          ts: Date.parse(bounce.Date),
        });
        this.db.set("lastBounceDate", bounce.Date);
      }
    }
  },
};
