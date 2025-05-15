import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "wakatime-new-goal-created",
  name: "New Goal Created",
  description: "Emit new event when a new goal is created in WakaTime. [See the documentation](https://wakatime.com/developers#goals)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.wakatime.listGoals;
    },
    getSummary(item) {
      return `New Goal Created: ${item.title}`;
    },
  },
  sampleEmit,
};
