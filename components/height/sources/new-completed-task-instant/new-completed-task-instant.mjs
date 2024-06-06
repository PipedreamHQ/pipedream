import { axios } from "@pipedream/platform";
import height from "../../height.app.mjs";

export default {
  key: "height-new-completed-task-instant",
  name: "New Completed Task Instant",
  description: "Emit new event when a task is marked as complete. [See the documentation](https://height.com/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    height,
    taskId: height.propDefinitions.taskId,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, ts,
      } = data;
      return {
        id,
        summary: `Task Completed: ${id}`,
        ts,
      };
    },
  },
  async run() {
    await this.height.markTaskAsComplete(this.taskId);
    const eventData = {
      id: this.taskId,
      ts: +new Date(),
    };
    this.$emit(eventData, this.generateMeta(eventData));
  },
};
