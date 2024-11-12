import campaignMonitor from "../../campaign_monitor.app.mjs";

export default {
  key: "campaign_monitor-new-subscriber",
  name: "New Subscriber",
  description: "Emits an event when a new subscriber is added to a specific list",
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
    listId: {
      propDefinition: [
        campaignMonitor,
        "listId",
      ],
    },
  },
  methods: {
    _getLastEvent() {
      return this.db.get("lastEvent") || null;
    },
    _setLastEvent(lastEvent) {
      this.db.set("lastEvent", lastEvent);
    },
  },
  async run() {
    const subscribers = await this.campaignMonitor.emitNewSubscriber(this.listId);
    if (!subscribers || subscribers.length === 0) {
      console.log("No new subscribers found");
      return;
    }

    let lastEvent = this._getLastEvent();
    subscribers.forEach((subscriber) => {
      if (!lastEvent || new Date(subscriber.Date) > new Date(lastEvent)) {
        lastEvent = subscriber.Date;
      }
      this.$emit(subscriber, {
        id: subscriber.EmailAddress,
        summary: `New subscriber ${subscriber.EmailAddress}`,
        ts: Date.parse(subscriber.Date),
      });
    });

    this._setLastEvent(lastEvent);
  },
};
