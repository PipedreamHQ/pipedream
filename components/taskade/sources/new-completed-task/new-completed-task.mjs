import taskade from "../../taskade.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "taskade-new-completed-task",
  name: "New Completed Task",
  description: "Emit new event when a task in a Taskade project is marked as complete."
    + " The source polls the tasks of the project and emits each task that changed to complete since the last poll."
    + " If a task is marked incomplete and then complete again, the source emits it again."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/projects/get-project-tasks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    taskade,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        taskade,
        "projectId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const tasks = await this.getTasks();
      const completedIds = {};
      for (const task of tasks) {
        if (task.completed) {
          completedIds[task.id] = true;
        }
      }
      this._setCompletedIds(completedIds);
    },
  },
  methods: {
    _getCompletedIds() {
      return this.db.get("completedIds") || {};
    },
    _setCompletedIds(completedIds) {
      this.db.set("completedIds", completedIds);
    },
    async getTasks() {
      const tasks = [];
      const items = this.taskade.paginate({
        resourceFn: this.taskade.listTasks,
        args: {
          projectId: this.projectId,
          params: {
            limit: 1000,
          },
        },
        resourceType: "items",
      });
      for await (const item of items) {
        tasks.push(item);
      }
      return tasks;
    },
    generateMeta(task, ts) {
      return {
        id: `${task.id}-${ts}`,
        summary: `Task Completed: ${task.text || task.id}`,
        ts,
      };
    },
  },
  async run() {
    const tasks = await this.getTasks();
    const previousIds = this._getCompletedIds();
    const completedIds = {};
    const ts = Date.now();
    for (const task of tasks) {
      if (!task.completed) {
        continue;
      }
      completedIds[task.id] = true;
      if (!previousIds[task.id]) {
        this.$emit(task, this.generateMeta(task, ts));
      }
    }
    this._setCompletedIds(completedIds);
  },
  sampleEmit,
};
