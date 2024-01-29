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
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(item, fieldId) {
      this.db.set("lastId", item[fieldId]);
    },
    generateMeta(event, fieldId) {
      return {
        id: event[fieldId],
        summary: this.getSummary(event),
        ts: Date.parse(event.createdAt),
      };
    },
    filterArray(item, lastId) {
      return Date.parse(item.createdAt) > Date.parse(lastId);
    },
    async startEvent(maxResults = 0) {
      const lastId = this._getLastId();

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
        (item) => this.filterArray(item, lastId),
      ).reverse();
      if (responseArray.length > maxResults) responseArray.length = maxResults;
      if (responseArray.length) this._setLastId(responseArray[0], this.getIdField());

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item, this.getIdField()));
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
