import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { getDateFormatted } from "../../common/utils.mjs";
import app from "../../signaturit.app.mjs";

export default {
  props: {
    app,
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

      const response = this.app.paginate({
        fn: this.app.listSignatureRequests,
        params: {
          status: "completed",
          since: getDateFormatted(lastDate),
        },
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item.created_at) <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(Date.parse(responseArray[0].created_at));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `New signed document: ${item.id}`,
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
