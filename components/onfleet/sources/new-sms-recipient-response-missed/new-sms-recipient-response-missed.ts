import moment from "moment";
import base from "../common/base";

export default {
  ...base,
  key: "onfleet-new-sms-recipient-response-missed",
  name: "New SMS Recipient Response Missed (Instant)",
  description: "Emit new event when a new SMS recipient response is missed.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...base.methods,
    getTrigger() {
      return 14;
    },
    generateMeta({
      id, taskId, time, timeCreated,
    }) {
      return {
        id: `${taskId || id}${time || timeCreated}`,
        summary: `New SMS recipient response missed: ${taskId || id}`,
        ts: moment(time || timeCreated).format(),
      };
    },
    async startDeploy() {
      //It doesn't have pagination and sorting.
      return;
    },
  },
};
