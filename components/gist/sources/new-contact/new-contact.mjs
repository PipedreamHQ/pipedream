import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import gist from "../../gist.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "gist-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    gist,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Gist API on this schedule",
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
    async startEvent(maxResults = 0) {
      const lastId = this._getLastId();
      const items = this.gist.paginate({
        fn: this.gist.listContacts,
        params: {
          order_by: "id",
          order: "desc",
        },
        maxResults,
      });

      let responseArray = [];

      for await (const item of items) {
        if (item.id <= lastId) break;
        responseArray.push(item);
      }
      if (responseArray.length) {
        this._setLastId(responseArray[0].id);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: `New contact created: ${item.full_name || item.email} (${item.id})`,
            ts: item.created_at,
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
  sampleEmit,
};
