import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { LIMIT } from "../../common/constants.mjs";
import vapi from "../../vapi.app.mjs";

export default {
  props: {
    vapi,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const fn = this.getFunction();

      const response = await fn({
        params: {
          createdAtGt: lastDate,
          limit: LIMIT,
        },
      });

      if (response.length) {
        if (maxResults && (response.length > maxResults)) {
          response.length = maxResults;
        }
        this._setLastDate(response[0].createdAt);
      }

      for (const item of response.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.parse(item.createdAt),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
};
