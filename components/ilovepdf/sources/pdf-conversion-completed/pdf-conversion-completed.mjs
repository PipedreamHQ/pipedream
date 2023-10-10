import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import ilovepdf from "../../ilovepdf.app.mjs";

export default {
  key: "ilovepdf-pdf-conversion-completed",
  name: "PDF Conversion Completed",
  description: "Emit new event when a PDF conversion process has completed. [See the documentation](https://developer.ilovepdf.com/docs/api-reference#introduction)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ilovepdf,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    task: {
      propDefinition: [
        ilovepdf,
        "task",
      ],
    },
  },
  methods: {
    _getTaskId() {
      return this.db.get("taskId");
    },
    _setTaskId(taskId) {
      this.db.set("taskId", taskId);
    },
  },
  hooks: {
    async deploy() {
      let taskId = this._getTaskId();
      if (taskId) {
        const taskStatus = await this.ilovepdf.downloadFiles({
          task: taskId,
        });
        if (taskStatus.status === "TaskSuccess") {
          this.$emit(taskStatus, {
            id: taskStatus.task,
            summary: `Task ${taskStatus.task} has completed`,
            ts: Date.now(),
          });
        }
      }
    },
  },
  async run() {
    let taskId = this._getTaskId();
    if (taskId) {
      const taskStatus = await this.ilovepdf.downloadFiles({
        task: taskId,
      });
      if (taskStatus.status === "TaskSuccess") {
        this.$emit(taskStatus, {
          id: taskStatus.task,
          summary: `Task ${taskStatus.task} has completed`,
          ts: Date.now(),
        });
        this._setTaskId(taskStatus.task);
      }
    }
  },
};
