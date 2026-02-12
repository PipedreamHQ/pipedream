import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "float-new-logged-time",
  name: "New Logged Time",
  description: "Emit new event when a new logged time entry is created. [See the documentation](https://developer.float.com/api_reference.html#!/Logged_Time/getLoggedTimes)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "logged_time_id";
    },
    getFunction() {
      return this.float.listLoggedTime;
    },
    getSummary(item) {
      return `New Logged Time Created: ${item.logged_time_id}`;
    },
  },
  sampleEmit,
};
