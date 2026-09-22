import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import helpwise from "../../helpwise.app.mjs";

export default {
  props: {
    helpwise,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    mailboxId: {
      propDefinition: [
        helpwise,
        "mailboxId",
      ],
    },
  },
  methods: {
    getParams() {
      return {};
    },
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();
      const fn = this.getFunction();
      const response = this.helpwise.paginate({
        fn,
        maxResults,
        fieldData: this.getFieldData(),
        params: {
          mailboxId: this.mailboxId,
          ...this.getParams(),
        },
      });

      let responseArray = [];
      for await (const item of response) {
        if (item.id === lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
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
