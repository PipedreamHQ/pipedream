import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "forcemanager-new-activity",
  name: "New Activity",
  description: "Emit new event when a new activity is created. [See the documentation](https://developer.forcemanager.com/#eadff4f2-ef77-44f3-ac48-16fe732ea127)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.forcemanager.listActivities;
    },
    getSummary(activity) {
      return `New Activity: ${activity.id}`;
    },
  },
  sampleEmit,
};
