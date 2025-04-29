import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import skyvern from "../../skyvern.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "skyvern-new-or-updated-workflow",
  name: "New or Updated Workflow",
  description: "Emit new event when a workflow is created or updated in Skyvern.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    skyvern,
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

      const response = this.skyvern.paginate({
        fn: this.skyvern.listWorkflows,
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item.modified_at) <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(responseArray[0].modified_at);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: `${item.modified_at}-${item.workflow_permanent_id}`,
          summary: `New Workflow ${item.version === 1
            ? "Created"
            : "Updated"}: ${item.title}`,
          ts: Date.parse(item.modified_at),
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
