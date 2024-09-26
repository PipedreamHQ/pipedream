import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sonix from "../../sonix.app.mjs";

export default {
  key: "sonix-media-upload-complete",
  name: "New Media Upload Complete",
  description: "Emit new event any time the media status of an item changes to completed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    sonix,
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
      return this.db.get("lastDate") ?? 0;
    },
    _setLastDate(status) {
      this.db.set("lastDate", status);
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();
      const items = this.sonix.paginate({
        fn: this.sonix.listMedia,
        maxResults,
        params: {
          status: "completed",
        },
      });

      let responseArray = [];

      for await (const item of items) {
        if (new Date(item.created_at) <= new Date(lastDate)) break;
        responseArray.push(item);
      }
      if (responseArray.length) this._setLastDate(responseArray[0].created_at);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: `Media upload completed: ${item.name}`,
            ts: Date.parse(item.created_at),
          },
        );
      }
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
};
