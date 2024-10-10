import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import pdfmonkey from "../../pdfmonkey.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "pdfmonkey-new-document-generated",
  name: "New Document Generated",
  description: "Emit new event when a document's generation is completed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    pdfmonkey,
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
      const response = this.pdfmonkey.paginate({
        fn: this.pdfmonkey.listDocuments,
        maxResults,
        params: {
          "q[status]": "success",
          "q[updated_since]": lastDate,
        },
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(Date.parse(responseArray[0].created_at));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `Document ${item.filename || item.id} Generation Completed`,
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
  sampleEmit,
};
