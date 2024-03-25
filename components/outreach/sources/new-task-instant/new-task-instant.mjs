import { axios } from "@pipedream/platform";
import outreach from "../../outreach.app.mjs";

export default {
  key: "outreach-new-task-instant",
  name: "New Task Instant",
  description: "Emits a new event when a task is created, updated, destroyed, or completed. [See the documentation]()",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    outreach,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch tasks initially on deploy
      const tasks = await this.outreach.getTasks();
      tasks.forEach((task) => {
        this.$emit(task, {
          id: task.id,
          summary: `Task: ${task.title}`,
          ts: Date.parse(task.updated_at),
        });
      });
    },
  },
  methods: {
    _getStoredTaskId() {
      return this.db.get("lastTaskId") || null;
    },
    _storeTaskId(taskId) {
      this.db.set("lastTaskId", taskId);
    },
  },
  async run() {
    const lastTaskId = this._getStoredTaskId();
    let newLastTaskId = lastTaskId;

    // Fetch latest tasks
    const tasks = await this.outreach.getTasks();
    tasks.forEach((task) => {
      // Emit only new or updated tasks
      if (!lastTaskId || task.id > lastTaskId) {
        this.$emit(task, {
          id: task.id,
          summary: `Task: ${task.title}`,
          ts: Date.parse(task.updated_at),
        });
        newLastTaskId = Math.max(newLastTaskId, task.id);
      }
    });

    // Update stored task ID with the latest
    if (newLastTaskId !== lastTaskId) {
      this._storeTaskId(newLastTaskId);
    }
  },
};
