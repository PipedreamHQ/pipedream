import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import voluum from "../../voluum.app.mjs";

export default {
  props: {
    voluum,
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
      const itemsField = this.getItemsField();
      const fn = this.getFunction();
      const response = this.voluum.paginate({
        fn,
        maxResults,
        itemsField,
        params: {
          ...this.getParams(),
          from: lastDate,
        },
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(responseArray[0].editTime);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.entityId,
          summary: this.getSummary(item),
          ts: Date.parse(item.editTime),
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
