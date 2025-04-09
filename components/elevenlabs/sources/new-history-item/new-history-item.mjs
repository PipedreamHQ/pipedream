import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "elevenlabs-new-history-item",
  name: "New History Item Created",
  version: "0.0.3",
  description: "Emit new event when a new history item is created.",
  type: "source",
  dedupe: "unique",
  props: {
    elevenlabs,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the ElevenLabs on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId");
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async startEvent(maxResults) {
      const lastId = this._getLastId();
      let responseArray = [];

      const items = this.elevenlabs.paginate({
        fn: this.elevenlabs.listHistoryItems,
        maxResults,
      });

      for await (const item of items) {
        if (item.history_item_id === lastId) {
          break;
        }
        responseArray.push(item);
      }

      if (responseArray[0]) {
        this._setLastId(responseArray[0].history_item_id);
      }

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.history_item_id,
            summary: `A item with id: "${responseItem.history_item_id}" was created!`,
            ts: responseItem.date_unix,
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
