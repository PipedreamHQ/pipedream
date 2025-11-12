import common from "../common.mjs";

export default {
  ...common,
  key: "close-lead-status-changed",
  name: "New Lead Status Change",
  description: "Emit new event when a Lead's status is changed",
  version: "0.1.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        {
          object_type: "activity.lead_status_change",
          action: "created",
        },
      ];
    },
  },
};
