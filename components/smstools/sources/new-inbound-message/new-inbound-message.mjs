import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import smstools from "../../smstools.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "smstools-new-inbound-message",
  name: "New Inbound Message",
  description: "Emit new event when a new inbound message is received.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    smstools,
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
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();
      const response = this.smstools.paginate({
        fn: this.smstools.getInboxMessages,
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (item.ID <= lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastId(responseArray[0].ID);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.ID,
          summary: `New inbound message from ${item.sender}`,
          ts: Date.parse(item.date),
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
