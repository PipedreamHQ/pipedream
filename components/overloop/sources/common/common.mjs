import overloop from "../../overloop.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    overloop,
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
      await this.emitHistoricalEvents({
        limit: 10,
      });
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    getResultTs() {
      throw new Error("getResultTs is not implemented");
    },
    generateMeta() {
      throw new Error ("generateMeta is not implemented");
    },
    async processEvent(resourceFn, params, loopAll = false) {
      const lastTs = this._getLastTs() || 0;
      let maxLastTs = lastTs;

      const results = [];

      let page = 1;
      let done = false;
      while (!done) {
        const { data } = await resourceFn({
          params: {
            ...params,
            page_number: page,
          },
        });
        for (const result of data) {
          const resultTs = this.getResultTs(result);
          if (resultTs > lastTs) {
            results.push(result);
            maxLastTs = resultTs > maxLastTs
              ? resultTs
              : maxLastTs;
          } else {
            if (!loopAll) {
              done = true;
              break;
            }
          }
        }
        if (done || data?.length < 100) {
          break;
        }
        page++;
      }
      this._setLastTs(maxLastTs);
      return results;
    },
  },
};
