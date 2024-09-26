import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import parma from "../../parma.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "parma-new-relationship",
  name: "New Relationship Created",
  description: "Emit new event when a new relationship is created.",
  version: "0.0.1",
  type: "source",
  props: {
    parma,
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
    async startEvent(maxResults = 0) {
      const lastId = this._getLastId();
      const response = this.parma.paginate({
        fn: this.parma.listRelationships,
        maxResults,
      });

      let responseArray = [];

      for await (const item of response) {
        if (item.id <= lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastId(responseArray[0].id);

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `New Relationship: ${item.name}`,
          ts: Date.parse(new Date()),
        });
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
