import moment from "moment";
import base from "../common/base";

export default {
  ...base,
  key: "onfleet-new-task-created",
  name: "New Task Created (Instant)",
  description: "Emit new event when a new task is created.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...base.methods,
    getFn() {
      return this.onfleet.listTasks;
    },
    getField() {
      return "tasks";
    },
    getTrigger() {
      return 6;
    },
    generateMeta({
      id, taskId, time, timeCreated,
    }) {
      return {
        id: taskId || id,
        summary: `New Task Created: ${taskId || id}`,
        ts: moment(time || timeCreated).format(),
      };
    },
  },
};
