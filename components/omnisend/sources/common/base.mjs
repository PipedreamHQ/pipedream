import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import omnisend from "../../omnisend.app.mjs";

export default {
  props: {
    omnisend,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastCreatedAt() {
      return this.db.get("lastCreatedAt") || "01-01-1970";
    },
    _setLastCreatedAt(item) {
      this.db.set("lastCreatedAt", item.createdAt);
    },
    generateMeta(event) {
      return {
        id: event.createdAt,
        summary: this.getSummary(event),
        ts: Date.parse(event.createdAt),
      };
    },
    filterArray(item, lastCreatedAt) {
      return Date.parse(item.createdAt) > Date.parse(lastCreatedAt);
    },
    async startEvent(maxResults = 0) {
      const lastCreatedAt = this._getLastCreatedAt();

      const response = this.omnisend.paginate({
        dataField: this.getDataField(),
        fn: this.getFunction(),
        maxResults,
      });

      let responseArray = [];

      for await (const item of response) {
        responseArray.push(item);
      }

      responseArray = responseArray.filter(
        (item) => this.filterArray(item, lastCreatedAt),
      ).reverse();
      if (maxResults && (responseArray.length > maxResults)) responseArray.length = maxResults;
      if (responseArray.length) this._setLastCreatedAt(responseArray[0]);

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
