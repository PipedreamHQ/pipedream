import storyscale from "../../storyscale.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    storyscale,
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
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getTsField() {
      return "updated_at";
    },
    isRelevant() {
      return true;
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    async getRecentTours() {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const tours = [];
      const { data } = await this.storyscale.listTours();
      for (const tour of data) {
        const ts = Date.parse(tour[this.getTsField()]);
        if (ts > lastTs) {
          tours.push(tour);
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
      }
      this._setLastTs(maxTs);
      return tours;
    },
    async processEvent(limit) {
      let count = 0;
      const tours = await this.getRecentTours();
      for (const tour of tours) {
        if (this.isRelevant(tour)) {
          this.emitEvent(tour);
          count++;
          if (limit && count === limit) {
            break;
          }
        }
      }
    },
  },
  async run() {
    await this.processEvent();
  },
};
