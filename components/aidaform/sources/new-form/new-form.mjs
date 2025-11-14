import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import aidaform from "../../aidaform.app.mjs";

export default {
  key: "aidaform-new-form",
  name: "New Form Created",
  description: "Emit new event when a new form is created. [See the documentation](https://app.swaggerhub.com/apis/aidaform/AidaForm/1.1.0#/default/RetrieveFormsList)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    aidaform,
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
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate() || 0;
      let { items: responseArray } = await this.aidaform.listForms();

      responseArray = responseArray
        .filter((item) => item.created_at > lastDate)
        .sort((a, b) => b.created_at - a.created_at);

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(Date.parse(responseArray[0].created_at));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `New form created: ${item.data.name}`,
          ts: Date.parse(item.created_at),
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
