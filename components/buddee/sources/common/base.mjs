import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import buddee from "../../buddee.app.mjs";

export default {
  props: {
    buddee,
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
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const fn = this.getFunction();
      const sortKey = this.getSortKey();
      const response = this.buddee.paginate({
        fn,
        maxResults,
        params: {
          sort: `-${sortKey}`,
        },
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item[sortKey]) <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(Date.parse(responseArray[0][sortKey]));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: `${item.id}-${item[sortKey]}`,
          summary: this.getSummary(item),
          ts: Date.parse(item[sortKey]),
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
