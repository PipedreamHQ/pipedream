import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import wufoo from "../../wufoo.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "wufoo-new-form-entry",
  name: "New Form Entry",
  version: "0.0.1",
  description: "Emit new event when a new form entry received.",
  type: "source",
  dedupe: "unique",
  props: {
    wufoo,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Wufoo on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    formHash: {
      propDefinition: [
        wufoo,
        "formHash",
      ],
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
      const {
        wufoo,
        formHash,
      } = this;

      const lastId = this._getLastId();
      const items = wufoo.paginate({
        fn: wufoo.listFormEntries,
        params: {
          pageSize: 100,
        },
        formHash,
        maxResults,
      });

      let responseArray = [];

      for await (const item of items) {
        if (item.EntryId <= lastId) break;
        responseArray.push(item);
      }
      if (responseArray.length) this._setLastId(responseArray[0].EntryId);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.EntryId,
            summary: `A new form entry with id: "${item.EntryId}" was received!`,
            ts: new Date(item.DateCreated),
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
