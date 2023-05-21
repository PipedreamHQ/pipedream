import wealthbox from "../../wealthbox.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    wealthbox,
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
      const historicalEvents = await this.getEvents({
        params: {
          per_page: 25,
        },
      });
      if (!(historicalEvents?.length > 0)) {
        return;
      }
      this._setLastCreated(this.getCreatedAtTs(historicalEvents[0]));
      historicalEvents.forEach((event) => this.emitEvent(event));
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated");
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    getCreatedAtTs(event) {
      return (Date.parse(event.created_at)) / 1000;
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async processEvent(sorted = true) {
      const lastCreated = this._getLastCreated() || 0;
      let maxLastCreated = lastCreated;
      let total;
      const params = {
        per_page: 25,
        page: 1,
      };

      do {
        const events = await this.getEvents({
          params,
        });
        if (!(events?.length > 0)) {
          break;
        }
        total = events.length;
        for (const event of events) {
          const ts = this.getCreatedAtTs(event);
          if (ts > lastCreated) {
            this.emitEvent(event);
            if (ts > maxLastCreated) {
              maxLastCreated = ts;
            }
          } else if (sorted === true) {
            break;
          }
        }
        params.page += 1;
      } while (total === params.per_page);

      this._setLastCreated(maxLastCreated);
    },
  },
  async run() {
    await this.processEvent();
  },
};
