import zohoNotebook from "../../zoho_notebook.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    zohoNotebook,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    notebookId: {
      propDefinition: [
        zohoNotebook,
        "notebookId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getResourceFn() {
      return this.zohoNotebook.listNotecards;
    },
    getArgs() {
      return {
        notebookId: this.notebookId,
      };
    },
    getResourceType() {
      return "notecards";
    },
    isRelevant() {
      return true;
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta(item) {
      return {
        id: item.notecard_id,
        summary: this.getSummary(item),
        ts: Date.parse(item.created_at),
      };
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const resourceFn = this.getResourceFn();
      const args = this.getArgs();
      const resourceType = this.getResourceType();
      const items = this.zohoNotebook.paginate({
        resourceFn,
        args: {
          ...args,
          params: {
            ...args.params,
            sort_column: "-Notecard.CreatedTime",
          },
        },
        resourceType,
        max,
      });
      const results = [];
      for await (const item of items) {
        const ts = Date.parse(item.created_time);
        if (ts >= lastTs) {
          maxTs = Math.max(maxTs, ts);
          if (this.isRelevant(item)) {
            results.push(item);
          }
        } else {
          break;
        }
      }
      results.reverse().forEach((item) => this.emitEvent(item));
      this._setLastTs(maxTs);
    },
  },
  async run() {
    await this.processEvent();
  },
};

