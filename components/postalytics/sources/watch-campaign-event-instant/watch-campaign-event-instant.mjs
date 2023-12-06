import { axios } from "@pipedream/platform";
import postalytics from "../../postalytics.app.mjs";

export default {
  key: "postalytics-watch-campaign-event-instant",
  name: "Watch Campaign Event (Instant)",
  description: "Emits a new event when a new campaign event occurs. [See the documentation](https://postalytics.docs.apiary.io/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    postalytics,
    db: "$.service.db",
    campaignId: {
      propDefinition: [
        postalytics,
        "campaignId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15, // shorter interval for instant event checking
      },
    },
  },
  methods: {
    _getLastEventId() {
      return this.db.get("lastEventId") || 0;
    },
    _setLastEventId(eventId) {
      this.db.set("lastEventId", eventId);
    },
  },
  hooks: {
    async deploy() {
      // Fetch the most recent events to avoid emitting them in the future runs
      const lastEventId = this._getLastEventId();
      let maxEventId = lastEventId;

      const events = await this.postalytics.listCampaignEvents({
        campaignId: this.campaignId,
        lastEventId,
      });
      for (const event of events) {
        if (lastEventId === null || event.id > lastEventId) {
          maxEventId = Math.max(maxEventId, event.id);
        }
      }

      // Store the max event ID for the next run
      this._setLastEventId(maxEventId);
    },
  },
  async run() {
    const lastEventId = this._getLastEventId();
    let maxEventId = lastEventId;

    // Fetch new campaign events since the last check
    const events = await this.postalytics.listCampaignEvents({
      campaignId: this.campaignId,
      lastEventId,
    });
    for (const event of events) {
      this.$emit(event, {
        id: event.id,
        summary: `New Campaign Event: ${event.type}`,
        ts: Date.parse(event.timestamp),
      });
      maxEventId = Math.max(maxEventId, event.id);
    }

    // Store the max event ID for the next run
    this._setLastEventId(maxEventId);
  },
};
