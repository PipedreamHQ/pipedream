import storeganise from "../../storeganise.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    storeganise,
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
    _getLastCreated() {
      return this.db.get("lastCreated");
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    getParams() {
      return {};
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async processEvent(max) {
      const lastCreated = this._getLastCreated();
      let maxCreated = lastCreated;
      const resourceFn = this.getResourceFn();
      const params = {
        ...this.getParams(lastCreated),
        limit: max || 50,
        offset: 0,
      };
      let total, done, count = 0;

      do {
        const items = await resourceFn({
          params,
        });
        total = items?.length;
        if (!total) {
          break;
        }
        for (const item of items) {
          if (!lastCreated || (Date.parse(item.created) >= Date.parse(lastCreated))) {
            const meta = this.generateMeta(item);
            this.$emit(item, meta);
            if (!maxCreated || (Date.parse(item.created) > Date.parse(maxCreated))) {
              maxCreated = item.created;
            }
            count++;
            if (max && count >= max) {
              done = true;
              break;
            }
          }
        }
        params.offset += params.limit;
      } while (total === params.limit && !done);

      this._setLastCreated(maxCreated);
    },
  },
  async run() {
    await this.processEvent();
  },
};
