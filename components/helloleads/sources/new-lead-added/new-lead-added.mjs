import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import helloleads from "../../helloleads.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "helloleads-new-lead-added",
  name: "New Lead Added",
  version: "0.0.1",
  description: "Emit new event when a new lead is created.",
  type: "source",
  dedupe: "unique",
  props: {
    helloleads,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the HelloLeads API on this schedule",
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
      const items = this.helloleads.paginate({
        fn: this.helloleads.listLeads,
        maxResults,
      });

      let responseArray = [];

      for await (const item of items) {
        if (item.id <= lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastId(responseArray[0].id);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: `A new lead with id: "${item.id}" was added!`,
            ts: Date.parse(item.created),
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
