import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import connecteam from "../../connecteam.app.mjs";

export default {
  props: {
    connecteam,
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
      return this.db.get("lastDate") || 1;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    getProps() {
      return {};
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const modelField = this.getModelField();
      const modelFieldId = this.getModelFieldId();
      const modelDateField = this.getModelDateField();

      const response = this.connecteam.paginate({
        fn: this.getFunction(),
        maxResults,
        modelField,
        ...this.getProps(),
        params: {
          sort: "created_at",
          order: "desc",
          ...this.getParams(lastDate),
        },
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(responseArray[0][modelDateField]);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item[modelFieldId],
          summary: this.getSummary(item),
          ts: modelDateField,
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
