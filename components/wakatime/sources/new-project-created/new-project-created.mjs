import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "wakatime-new-project-created",
  name: "New Project Created",
  description: "Emit new event when a new project is created in WakaTime. [See the documentation](https://wakatime.com/developers#projects)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.wakatime.listProjects;
    },
    getSummary(item) {
      return `New Project Created: ${item.name}`;
    },
  },
  sampleEmit,
};
