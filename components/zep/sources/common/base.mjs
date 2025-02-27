import zep from "../../zep.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    zep,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const results = await this.getNewResults(lastTs, max);
      results.forEach((item) => this.emitEvent(item));
    },
    async getSessions({
      lastTs, orderBy, max, updateLastTs = true,
    }) {
      const params = {
        page_size: max || 1000,
        order_by: orderBy,
        asc: false,
      };

      const { sessions: results } = await this.zep.listSessions({
        params,
      });

      const sessions = [];
      for (const session of results) {
        const ts = Date.parse(session[orderBy]);
        if (ts >= lastTs) {
          sessions.push(session);
        } else {
          break;
        }
        if (max && sessions.length >= max) {
          break;
        }
      }

      if (!sessions.length) {
        return [];
      }
      if (updateLastTs) {
        this._setLastTs(Date.parse(sessions[0][orderBy]));
      }
      return sessions.reverse();
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    getNewResults() {
      throw new Error("getNewResults is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
};
