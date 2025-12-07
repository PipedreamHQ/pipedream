import breeze from "../../breeze.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "breeze-task-moved",
  name: "Task Moved",
  description: "Emit new event when a task is moved to another list. [See documentation](https://www.breeze.pm/api#:~:text=Get%20cards)",
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
      description: "How often to poll the Breeze API for task movements",
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
        id: `${task.id}-${task.stage_id}-${Date.now()}`,
        summary: `Task "${task.name || task.id}" moved to stage ${task.stage?.name || task.stage_id}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const lastStageId = this.db.get("lastStageId");
    const taskId = parseInt(this.taskId); //Need to coerce into integer for comparing

    const tasks = await this.breeze.getTasks({
      projectId: this.projectId,
    });

    const task = tasks.find((t) => parseInt(t.id) === taskId);
    if (!task) {
      // Task not found, reset state
      this.db.set("lastStageId", null);
      return;
    }

    const currentStageId = task.stage_id;
    // Check if the task has moved to a different stage
    if (lastStageId !== currentStageId) {
      this.$emit({
        ...task,
      }, this.generateMeta(task));
    }

    // Update the stored stage ID
    this.db.set("lastStageId", currentStageId);
  },
};

