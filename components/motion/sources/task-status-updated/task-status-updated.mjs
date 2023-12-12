import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import motion from "../../motion.app.mjs";

export default {
  key: "motion-task-status-updated",
  name: "Task Status Updated",
  version: "0.0.1",
  description: "Emit new event when the status of a specific task is updated.",
  type: "source",
  dedupe: "unique",
  props: {
    motion,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Motion API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    taskId: {
      propDefinition: [
        motion,
        "taskId",
      ],
    },
  },
  methods: {
    _getLastStatusName() {
      return this.db.get("lastStatusName");
    },
    _setLastStatusName(lastStatusName) {
      this.db.set("lastStatusName", lastStatusName);
    },
    async startEvent() {
      const { taskId } = this;
      const lastStatusName = this._getLastStatusName();

      const task = await this.motion.getTask({
        taskId,
      });

      if (lastStatusName != task.status.name) {
        const ts = Date.now();
        this.$emit(
          task,
          {
            id: `${task.id}+${ts}`,
            summary: `The status of the task: "${taskId}" was updated!`,
            ts,
          },
        );

        this._setLastStatusName(task.status.name);
      }
    },
  },
  async run() {
    await this.startEvent();
  },
};
