import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import evenium from "../../evenium.app.mjs";

export default {
  props: {
    evenium,
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
      return this.db.get("lastDate");
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    getFieldId() {
      throw new Error("getFieldId is not implemented");
    },
    getFunction() {
      throw new Error("getFunction is not implemented");
    },
    getDataField() {
      throw new Error("getDataField is not implemented");
    },
    getArgs() {
      return {};
    },
    async processEvents(maxResults = false) {
      const lastDate = this._getLastDate();
      const fields = this.getFields();
      const response = this.evenium.paginate({
        fn: this.getFunction(),
        ...this.getArgs(),
        dataField: fields.data,
        params: {
          [fields.filter]: lastDate,
          maxResults,
        },
      });

      const responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(responseArray[0][fields.date]);
      }

      for (const result of responseArray.reverse()) {
        this.$emit(result, {
          id: result[fields.id],
          summary: this.getSummary(result),
          ts: Date.parse(result[fields.date]),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents();
  },
};

