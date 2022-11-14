import { defineSource } from "@pipedream/types";
import { WebhookData } from "../../common/types";
import common from "../common";

export default defineSource({
  ...common,
  name: "Task Moved",
  description: "Emit new event when a **task is moved**",
  key: "kanbanflow-task-moved",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getHookFilter() {
      return {
        filter: {
          changedProperties: ["columnId", "swimlaneId"]
        }
      }
    },
    getHookName() {
      return "Task Moved";
    },
    getHookType() {
      return "taskChanged";
    },
    getSummary({ task: { name }, userFullName }: WebhookData) {
      return `"${name}" moved by ${userFullName}`;
    },
  },
});
