import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import transloadit from "../../transloadit.app.mjs";

export default {
  props: {
    transloadit,
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
      return this.db.get("lastDate") || "1970-01-01 00:00:00";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const response = this.transloadit.paginate({
        fn: this.transloadit.listAssemblies,
        params: {
          fromdate: lastDate,
          type: this.getType(),
        },
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item.created) <= Date.parse(lastDate)) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(responseArray[0].created);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: item.created_ts,
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
