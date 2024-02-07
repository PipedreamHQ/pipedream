import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import postmark from "../postmark.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  props: {
    postmark,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getWebhookProps() {
      return {};
    },
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async startEvent(maxResults = 0) {
      const lastId = this._getLastId();
      const response = this.postmark.paginate({
        fn: this.getFunction(),
        fieldList: this.getFieldList(),
      });

      let responseArray = [];

      for await (const item of response) {
        responseArray.push(item);
      }

      responseArray = responseArray.filter((item) => item.ID > lastId).reverse();
      if (maxResults && response.length) responseArray.length = maxResults;
      if (responseArray.length) this._setLastId(responseArray[0].ID);

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
    generateMeta(data) {
      const ts = new Date();
      return {
        id: `${data.ID}-${ts}`,
        summary: this.getSummary(data),
        ts: Date.parse(ts),
      };
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
  sampleEmit,
};
