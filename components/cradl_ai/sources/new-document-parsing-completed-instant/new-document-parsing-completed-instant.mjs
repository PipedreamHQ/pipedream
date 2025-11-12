import cradlAi from "../../cradl_ai.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "cradl_ai-new-document-parsing-completed-instant",
  name: "New Document Parsing Completed (Instant)",
  description: "Emit new event when a document processing flow has completed.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    cradlAi,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workflowId: {
      propDefinition: [
        cradlAi,
        "workflowId",
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
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta(item) {
      return {
        id: item.executionId,
        summary: `Execution completed with ID ${item.executionId}`,
        ts: Date.parse(item.endTime),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const results = this.cradlAi.paginate({
        resourceFn: this.cradlAi.listExecutions,
        args: {
          workflowId: this.workflowId,
          params: {
            order: "descending",
            sortBy: "endTime",
            status: [
              "completed",
            ],
          },
        },
        resourceType: "executions",
        max,
      });
      const executions = [];
      for await (const item of results) {
        const ts = Date.parse(item.endTime);
        if (ts >= lastTs) {
          executions.push(item);
        } else {
          break;
        }
      }
      if (!executions.length) {
        return;
      }
      this._setLastTs(Date.parse(executions[0].endTime));
      executions.reverse().forEach((item) => this.emitEvent(item));
    },
  },
  async run() {
    await this.processEvent();
  },
};
