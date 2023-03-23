import moment from "moment";
import base from "../common/base";

export default {
  ...base,
  key: "onfleet-new-worker-duty",
  name: "New Worker Duty (Instant)",
  description: "Emit new event when a worker status is changed.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...base.methods,
    getTrigger() {
      return 3;
    },
    generateMeta({
      id, workerId, time, timeCreated,
    }) {
      return {
        id: `${workerId || id}${time || timeCreated}`,
        summary: `New worker status changed: ${workerId || id}`,
        ts: moment(time || timeCreated).format(),
      };
    },
    async startDeploy() {
      //It doesn't have pagination and sorting.
      return;
    },
  },
};
