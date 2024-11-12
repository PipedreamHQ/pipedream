import campaignMonitor from "../../campaign_monitor.app.mjs";

export default {
  key: "campaign_monitor-new-email-open",
  name: "New Email Open",
  description: "Emits a new event when an email from a campaign is opened",
  version: "0.0.1",
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
    subscriberId: {
      propDefinition: [
        campaignMonitor,
        "subscriberId",
      ],
      optional: true,
    },
  },
  methods: {
    _getEventMeta(event) {
      const ts = +new Date(event.Date);
      const summary = `New email open: ${event.EmailAddress}`;
      const id = `${event.EmailAddress}-${ts}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const since = this.db.get("since");
    const { Results: events } =
      await this.campaignMonitor.emitCampaignEmailOpen(this.campaignId, this.subscriberId);
    for (const event of events) {
      if (since && new Date(event.Date) <= new Date(since)) {
        console.log("This email open event is old, skipping");
        continue;
      }
      this.$emit(event, this._getEventMeta(event));
    }
    this.db.set("since", new Date());
  },
};
