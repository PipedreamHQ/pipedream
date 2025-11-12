import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import dealmachine from "../../dealmachine.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "dealmachine-new-lead",
  name: "New Lead",
  version: "0.0.2",
  description: "Emit new event when a new lead is created.",
  type: "source",
  dedupe: "unique",
  props: {
    dealmachine,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the DealMachine on this schedule",
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
      const { dealmachine } = this;

      const lastId = this._getLastId();
      const items = dealmachine.paginate({
        fn: dealmachine.listLeads,
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
            summary: `A new lead with id: "${item.id}" was created!`,
            ts: new Date(),
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
