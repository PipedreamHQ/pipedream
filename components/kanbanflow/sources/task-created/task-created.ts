import { defineSource } from "@pipedream/types";
import { WebhookData } from "../../common/types";
import common from "../common";

export default defineSource({
  ...common,
  name: "Task Created",
  description: "Emit new event when a **new task is created**",
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
    getSummary({ task: { name }, userFullName }: WebhookData) {
      return `"${name}" created by ${userFullName}`;
    },
  },
});
