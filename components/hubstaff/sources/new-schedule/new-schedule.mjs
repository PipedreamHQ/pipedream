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
    getParams() {
      return {
        "date[start]": "1970-01-01",
        "date[stop]": ((d) => new Date(d.getFullYear() + 1000, d.getMonth(), d.getDate()))(new Date),
      };
    },
    getSummary(item) {
      return `New Schedule: ${item.id}`;
    },
  },
  sampleEmit,
};
