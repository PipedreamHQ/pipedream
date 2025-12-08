import app from "../../brainbase_labs.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "brainbase_labs-new-deployment-log-created",
  name: "New Deployment Log Created",
  description: "Emit new event when a new deployment log is created. [See the documentation](https://docs.usebrainbase.com/api-reference/voice-deployment-logs/list-voice-deployment-logs-for-a-worker-with-optional-filtering-and-pagination)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workerId: {
      propDefinition: [
        app,
        "workerId",
      ],
    },
    deploymentId: {
      propDefinition: [
        app,
        "deploymentId",
        (c) => ({
          workerId: c.workerId,
        }),
      ],
      description: "Filter logs by deployment ID",
      optional: true,
    },
    flowId: {
      propDefinition: [
        app,
        "flowId",
        (c) => ({
          workerId: c.workerId,
        }),
      ],
      description: "Filter logs by flow ID",
      optional: true,
    },
  },
  methods: {
    _getLastStartTs() {
      return this.db.get("lastStartTs") || 0;
    },
    _setLastStartTs(startTs) {
      this.db.set("lastStartTs", startTs);
    },
    async *paginateLogs() {
      let page = 1, hasMore = true;
      do {
        const {
          data, pagination,
        } = await this.app.listVoiceDeploymentLogs({
          workerId: this.workerId,
          params: {
            deploymentId: this.deploymentId,
            flowId: this.flowId,
            page,
            limit: 100,
          },
        });
        for (const log of data) {
          yield log;
        }
        hasMore = pagination.hasNext;
        page++;
      } while (hasMore);
    },
    async processEvent(max) {
      const lastStartTs = this._getLastStartTs();
      let maxStartTs = lastStartTs;
      let logs = [];

      const results = this.paginateLogs();
      for await (const log of results) {
        const ts = Date.parse(log.startTime);
        if (ts > lastStartTs) {
          maxStartTs = Math.max(maxStartTs, ts);
          logs.push(log);
        }
      }

      this._setLastStartTs(maxStartTs);

      if (!logs.length) {
        return;
      }

      if (max && logs.length > max) {
        logs = logs.slice(0, max);
      }

      logs.forEach((log) => {
        this.$emit(log, this.generateMeta(log));
      });
    },
    generateMeta(log) {
      return {
        id: log.id,
        summary: `New Deployment Log: ${log.id}`,
        ts: Date.parse(log.startTime),
      };
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(10);
    },
  },
  async run() {
    await this.processEvent();
  },
};
