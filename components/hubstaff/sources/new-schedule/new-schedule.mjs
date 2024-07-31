import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubstaff-new-schedule",
  name: "New Schedule Created",
  description: "Emit new event when a schedule is created in Hubstaff.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getModel() {
      return "attendance_schedules";
    },
    getFunction() {
      return this.hubstaff.listSchedules;
    },
    getParams(lastDate) {
      return {
        "date[start]": lastDate,
        "date[stop]": Date.now(),
      };
    },
    getSummary(item) {
      return `New Schedule: ${item.id}`;
    },
  },
  sampleEmit,
};
