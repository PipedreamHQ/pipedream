import openai from "../../openai.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "openai-new-run-state-change",
  name: "New Run State Change",
  description: "Emits an event every time a run changes its status. [See the documentation](https://platform.openai.com/docs/api-reference/)",
  version: "0.0.{{ts}}",
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
    threadId: {
      type: "string",
      label: "Thread ID",
      description: "The unique identifier for the thread.",
    },
    runId: {
      propDefinition: [
        openai,
        "runId",
        (c) => ({
          threadId: c.threadId,
        }),
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
    _getPreviousStatus() {
      return this.db.get("previousStatus") ?? {};
    },
    _setPreviousStatus(value) {
      this.db.set("previousStatus", value);
    },
  },
  async run() {
    const previousStatus = this._getPreviousStatus();
    const currentRun = await this.openai._makeRequest({
      path: `/runs/${this.runId}`,
    });

    if (currentRun.id && previousStatus[currentRun.id] !== currentRun.status && this.statuses.includes(currentRun.status)) {
      this.$emit({
        id: currentRun.id,
        status: currentRun.status,
      }, {
        id: currentRun.id,
        summary: `Run ${currentRun.id} changed status to ${currentRun.status}`,
        ts: Date.now(),
      });
      previousStatus[currentRun.id] = currentRun.status;
      this._setPreviousStatus(previousStatus);
    }
  },
};
