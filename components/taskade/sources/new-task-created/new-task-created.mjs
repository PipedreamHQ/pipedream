import taskade from "../../taskade.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "taskade-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a new task is created in Taskade",
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
      await this.processEvent(25);
    },
  },
  methods: {
    _getPreviousIds() {
      return this.db.get("previousIds") || {};
    },
    _setPreviousIds(previousIds) {
      this.db.set("previousIds", previousIds);
    },
    emitEvent(task) {
      const meta = this.generateMeta(task);
      this.$emit(task, meta);
    },
    generateMeta(task) {
      return {
        id: task.id,
        summary: `New Task ID: ${task.id}`,
        ts: Date.now(),
      };
    },
    async processEvent(max) {
      const tasks = [];
      const items = this.taskade.paginate({
        resourceFn: this.taskade.listTasks,
        args: {
          projectId: this.projectId,
        },
        resourceType: "items",
      });
      for await (const item of items) {
        tasks.push(item);
      }
      let previousIds = this._getPreviousIds();
      let newTasks = tasks.filter(({ id }) => !previousIds[id]);
      newTasks.forEach(({ id }) => previousIds[id] = true);
      this._setPreviousIds(previousIds);
      newTasks = max
        ? newTasks.slice(0, max)
        : newTasks;
      newTasks.forEach((task) => this.emitEvent(task));
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
