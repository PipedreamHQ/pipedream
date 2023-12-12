import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  key: "clientary-new-task-created",
  name: "New Task Created",
  description: "Emit new events when a new task was created. [See the docs](https://www.clientary.com/api/tasks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getConfig() {
      return {
        resourceFnName: "getTasks",
        resourceName: "tasks",
        hasPaging: true,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSummary(item: any): string {
      return `New task ${item.title} ID(${item.id})`;
    },
  },
});
