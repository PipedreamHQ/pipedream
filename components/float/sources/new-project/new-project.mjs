import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "float-new-project",
  name: "New Project",
  description: "Emit new event when a new project is created. [See the documentation](https://developer.float.com/api_reference.html#!/Projects/getProjects)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "project_id";
    },
    getFunction() {
      return this.float.listProjects;
    },
    getSummary(item) {
      return `New Project Created: ${item.project_id}`;
    },
  },
  sampleEmit,
};
