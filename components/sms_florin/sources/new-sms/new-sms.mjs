import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../sms_florin.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "sms_florin-new-sms",
  name: "New SMS Received",
  description: "Emit a new event each time an SMS arrives on one of your rented numbers.",
  version: "0.0.1",
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
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async getNewMessages(lastId) {
      const { rentals } = await this.app.listRentals({
        params: {
          limit: 25,
        },
      });
      const events = [];
      for (const rental of rentals || []) {
        for (const message of rental.messages || []) {
          if (message.id > lastId) {
            events.push({
              rental,
              message,
            });
          }
        }
      }
      // Oldest first, so events are emitted in chronological order and the
      // greatest id is the last one persisted.
      return events.sort((a, b) => a.message.id - b.message.id);
    },
    emitEvent({
      rental, message,
    }) {
      this.$emit({
        ...message,
        rentalId: rental.id,
        service: rental.service?.name || null,
        serviceSlug: rental.service?.slug || null,
        phoneNumber: rental.phoneNumber,
        country: rental.country,
      }, {
        id: message.id,
        summary: `New SMS on ${rental.phoneNumber || rental.service?.name || "rented number"}`,
        ts: Date.parse(message.receivedAt) || Date.now(),
      });
    },
  },
  hooks: {
    async deploy() {
      // Don't replay codes that arrived before the source was set up — just
      // record the current high-water mark.
      const events = await this.getNewMessages(0);
      const lastId = events.at(-1)?.message?.id || 0;
      this._setLastId(lastId);
    },
  },
  async run() {
    const events = await this.getNewMessages(this._getLastId());
    for (const event of events) {
      this.emitEvent(event);
      this._setLastId(event.message.id);
    }
  },
  sampleEmit,
};
