import breeze from "../../breeze.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "breeze-task-status-updated",
  name: "Task Status Updated",
  description: "Emit new event when a task's status is updated. [See documentation](https://www.breeze.pm/api#:~:text=Get%20cards)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    breeze,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Breeze API for task status updates",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        breeze,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        breeze,
        "taskId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  methods: {
    generateMeta(task) {
      return {
        id: `${task.id}-${task.status_id || "null"}-${Date.now()}`,
        summary: `Task "${task.name || task.id}" status updated to ${task.status_name || "No Status"}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const lastStatusId = this.db.get("lastStatusId");
    const taskId = parseInt(this.taskId); //Need to coerce into integer for comparing

    const tasks = await this.breeze.getTasks({
      projectId: this.projectId,
    });

    const task = tasks.find((t) => parseInt(t.id) === taskId);

    if (!task) {
      // Task not found, reset state
      this.db.set("lastStatusId", null);
      return;
    }

    const currentStatusId = task.status_id;

    // Check if the task status has changed
    if (lastStatusId !== currentStatusId) {
      this.$emit({
        ...task,
      }, this.generateMeta(task));
    }

    // Update the stored status ID
    this.db.set("lastStatusId", currentStatusId);
  },
};

