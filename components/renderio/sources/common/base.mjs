import renderio from "../../renderio.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import {
  getRealTimestamp,
  getTimestamp,
  normalizeList,
} from "../../common/utils.mjs";

export default {
  props: {
    renderio,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "How often to poll the RenderIO API",
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
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const limit = 100;
      const maxPages = 1000;
      let offset = 0;
      let items = [];

      for (let page = 0; page < maxPages; page++) {
        const response = await this.getFn().call(this.renderio, {
          params: {
            limit,
            offset,
          },
        });
        const pageItems = normalizeList(response, this.getListKey());

        for (const item of pageItems) {
          const realTs = getRealTimestamp(item);
          if (realTs === null || realTs >= lastTs) {
            items.push(item);
          }
        }

        if (pageItems.length < limit) break;
        offset += limit;
      }

      items.sort((a, b) => getTimestamp(a) - getTimestamp(b));

      if (max && items.length > max) {
        items = items.slice(-max);
      }

      for (const item of items) {
        this.$emit(item, this.generateMeta(item));
      }

      if (items.length > 0) {
        let maxRealTs = null;
        for (const item of items) {
          const realTs = getRealTimestamp(item);
          if (realTs !== null && (maxRealTs === null || realTs > maxRealTs)) {
            maxRealTs = realTs;
          }
        }
        if (maxRealTs !== null) {
          this._setLastTs(maxRealTs);
        }
      }
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
