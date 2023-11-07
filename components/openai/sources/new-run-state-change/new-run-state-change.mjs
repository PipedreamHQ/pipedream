import openai from "../../openai.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "openai-new-run-state-change",
  name: "New Run State Change",
  description: "Emit new event every time a run changes its status. [See the documentation](https://platform.openai.com/docs/api-reference/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    openai,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    runId: {
      propDefinition: [
        openai,
        "runId",
      ],
    },
    threadId: {
      propDefinition: [
        openai,
        "threadId",
      ],
    },
    statuses: {
      propDefinition: [
        openai,
        "statuses",
      ],
    },
  },
  methods: {
    _getLastRunStatus() {
      return this.db.get("lastRunStatus") || null;
    },
    _setLastRunStatus(status) {
      this.db.set("lastRunStatus", status);
    },
  },
  async run() {
    const lastRunStatus = this._getLastRunStatus();
    const currentRunData = await this.openai.getRunStatus(this.runId);

    if (currentRunData.status !== lastRunStatus && this.statuses.includes(currentRunData.status)) {
      this.$emit(currentRunData, {
        id: this.runId,
        summary: `Run ID ${this.runId} changed status to ${currentRunData.status}`,
        ts: Date.now(),
      });
      this._setLastRunStatus(currentRunData.status);
    }
  },
};
