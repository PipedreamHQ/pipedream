import postalytics from "../../postalytics.app.mjs";

export default {
  key: "postalytics-new-campaign-event-instant",
  name: "New Campaign Event (Instant)",
  description: "Emits a new event when a Postalytics mail piece has a delivery or online response status change. [See the documentation](https://postalytics.docs.apiary.io/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    postalytics,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // Set a default polling interval
      },
    },
    campaignId: {
      propDefinition: [
        postalytics,
        "campaignId",
      ],
    },
  },
  methods: {
    _getEventLastFetchedTime() {
      return this.db.get("lastFetchedTime") || 0;
    },
    _setEventLastFetchedTime(lastFetchedTime) {
      this.db.set("lastFetchedTime", lastFetchedTime);
    },
  },
  hooks: {
    async deploy() {
      // Since this is an instant source, we don't need to fetch historical data
      // We just set the last fetched time to the current time during deploy
      this._setEventLastFetchedTime(Date.now());
    },
    async activate() {
      // TODO: Create a webhook subscription if needed
    },
    async deactivate() {
      // TODO: Delete a webhook subscription if needed
    },
  },
  async run() {
    const lastFetchedTime = this._getEventLastFetchedTime();
    const currentTime = Date.now();

    // Fetch events from the Postalytics API
    const events = await this.postalytics.getCampaignEvents({
      campaignId: this.campaignId,
      since: lastFetchedTime,
    });

    // Emit each event and update the last fetched time
    for (const event of events) {
      this.$emit(event, {
        id: event.id,
        summary: `New Event in Campaign ${this.campaignId}: ${event.type}`,
        ts: Date.parse(event.timestamp),
      });
    }

    // Update the last fetched time to the current time
    this._setEventLastFetchedTime(currentTime);
  },
};
