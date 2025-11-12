import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bugsnag-new-release-created",
  name: "New Release Created",
  description: "Emit new event when a new release version is deployed to a selected project.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.bugsnag.listReleases;
    },
    getArgs() {
      return {
        projectId: this.projectId,
        params: {
          sort: "timestamp",
        },
      };
    },
    getTsField() {
      return "release_time";
    },
    getSummary(item) {
      return `New Release ID: ${item.id}`;
    },
  },
  sampleEmit,
};
