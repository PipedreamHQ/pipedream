import exhibitday from "../../exhibitday.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "exhibitday-new-task-assigned",
  name: "New Task Assigned",
  description: "Emit new event when a task is assigned to a user in ExhibitDay.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    exhibitday,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task",
    },
    assignee: {
      type: "string",
      label: "Assignee",
      description: "The user assigned to the task",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the task",
    },
  },
  methods: {
    _getLastEvent() {
      return this.db.get("lastEvent") ?? null;
    },
    _setLastEvent(lastEvent) {
      this.db.set("lastEvent", lastEvent);
    },
  },
  hooks: {
    async deploy() {
      const lastEvent = await this.exhibitday.getNewTaskAssigned();
      if (lastEvent) {
        this._setLastEvent(lastEvent);
      }
    },
  },
  async run() {
    const lastEvent = this._getLastEvent();
    const tasks = await this.exhibitday.getNewTaskAssigned();

    for (const task of tasks) {
      if (!lastEvent || new Date(task.created) > new Date(lastEvent)) {
        this.$emit(task, {
          id: task.id,
          summary: `New Task Assigned: ${task.taskName}`,
          ts: Date.parse(task.created),
        });
      }
    }

    this._setLastEvent(tasks[0]);
  },
};
