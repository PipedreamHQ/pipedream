import magnetic from "../../magnetic.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "magnetic-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a new task is created [See docs here](https://app.magnetichq.com/Magnetic/API.do#ta-taskobject)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    magnetic,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const tasks = await this.magnetic.listTasks();
      if (!(tasks?.length > 0)) {
        return;
      }
      this._setLastCreated(tasks[tasks.length - 1].createdDate);
      tasks.slice(-25).reverse()
        .forEach((task) => this.emitEvent(task));
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated") || 0;
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    isRelevant(createdDate, lastCreated) {
      return createdDate > lastCreated;
    },
    generateMeta(task) {
      return {
        id: task.id,
        summary: task.task,
        ts: task.createdDate,
      };
    },
  },
  async run() {
    const tasks = await this.magnetic.listTasks();
    if (!(tasks?.length > 0)) {
      return;
    }

    const lastCreated = this._getLastCreated();
    this._setLastCreated(tasks[tasks.length - 1].createdDate);

    for (const task of tasks) {
      if (this.isRelevant(task.createdDate, lastCreated)) {
        this.emitEvent(task);
      }
    }
  },
};
