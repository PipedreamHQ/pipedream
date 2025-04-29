import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import theBookie from "../../the_bookie.app.mjs";

export default {
  props: {
    theBookie,
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
    filterItems(items, lastId) {
      return items
        .filter((item) => item.id > lastId)
        .sort((a, b) => b.id - a.id);
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();
      const response = this.theBookie.paginate({
        fn: this.getFunction(),
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        responseArray = this.filterItems(responseArray, lastId);

        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0].id);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.parse(new Date()),
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
