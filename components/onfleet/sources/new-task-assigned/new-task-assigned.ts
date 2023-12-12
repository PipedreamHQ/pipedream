import moment from "moment";
import base from "../common/base";

export default {
  ...base,
  key: "onfleet-new-task-assigned",
  name: "New Task Assigned (Instant)",
  description: "Emit new event when a new task is assigned.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...base.methods,
    getTrigger() {
      return 9;
    },
    generateMeta({
      id, taskId, time, timeCreated,
    }) {
      return {
        id: `${taskId || id}${time || timeCreated}`,
        summary: `New Task assigned: ${taskId || id}`,
        ts: moment(time || timeCreated).format(),
      };
    },
    async startDeploy() {
      //It doesn't have pagination and sorting.
      return;
    },
  },
};
