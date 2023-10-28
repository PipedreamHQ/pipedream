import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import ilovepdf from "../../ilovepdf.app.mjs";

export default {
  key: "ilovepdf-new-task-completed",
  name: "New Task Completed",
  description: "Emit new event for each new task. [See the documentation](https://developer.ilovepdf.com/docs/api-reference#task)",
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
    tool: {
      propDefinition: [
        ilovepdf,
        "tool",
      ],
      description: "If specified, events will only be emitted for tasks with this tool",
      optional: true,
    },
  },
  methods: {
    _setSavedItems(value) {
      this.db.set("tasks", value);
    },
    _getSavedItems() {
      return this.db.get("tasks") ?? [];
    },
    async getAndProcessItems() {
      const { token } = await this.ilovepdf.getAuthToken();

      const savedItems = this._getSavedItems();
      const tasks = await this.ilovepdf.listTasks({
        token,
        tool: this.tool,
      });

      tasks?.filter?.(({ task }) => !savedItems.includes(task)).forEach((task) => {
        const ts = Date.now();
        this.$emit(task, {
          id: task.task,
          summary: `New task (${task.tool}) - ${task.file_number} file${task.file_number === 1
            ? ""
            : "s"}`,
          ts,
        });
        savedItems.push(task.task);
      });

      this._setSavedItems(savedItems);
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessItems();
    },
  },
  async run() {
    await this.getAndProcessItems();
  },
};
