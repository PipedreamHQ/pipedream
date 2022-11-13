import { defineSource } from "@pipedream/types";
import common from "../common";

export default defineSource({
  ...common,
  name: "Task Created",
  description:
    "Emit new event when a **new task is created**",
  key: "kanbanflow-task-created",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getHookName() {
      return "Task Created";
    },
    getHookType() {
      return "taskCreated";
    },
    // getSummary(order: Order): string {
    //   return this.kanbanflow.getOrderSummary(order);
    // },
  },
});
