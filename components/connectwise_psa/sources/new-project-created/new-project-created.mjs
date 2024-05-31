import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "connectwise_psa-new-project-created",
  name: "New Project Created",
  description: "Emit new event when a new project is created in Connectwise.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.connectwise.listProjects;
    },
    getSummary(item) {
      return `New Project Created: ${item.name}`;
    },
  },
  sampleEmit,
};
