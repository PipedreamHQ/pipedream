import moment from "moment";
import base from "../common/base";

export default {
  ...base,
  key: "onfleet-new-task-deleted",
  name: "New Task Deleted (Instant)",
  description: "Emit new event when a new task is deleted.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...base.methods,
    getTrigger() {
      return 8;
    },
    generateMeta({
      id, taskId, time, timeCreated,
    }) {
      return {
        id: taskId || id,
        summary: `New Task Deleted: ${taskId || id}`,
        ts: moment(time || timeCreated).format(),
      };
    },
    async startDeploy() {
      return;
    },
  },
};
