import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import aidaform from "../../aidaform.app.mjs";

export default {
  key: "aidaform-new-form-response",
  name: "New Form Response",
  description: "Emit new event when a new form is responded to. [See the documentation](https://app.swaggerhub.com/apis/aidaform/AidaForm/1.1.0#/default/RetrieveResponsesList)",
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
    formId: {
      propDefinition: [
        aidaform,
        "formId",
      ],
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
      const response = this.aidaform.paginate({
        fn: this.aidaform.listResponses,
        formId: this.formId,
        params: {
          from: lastDate,
        },
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      responseArray = responseArray
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
          summary: `New form response with ID: ${item.id}`,
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
