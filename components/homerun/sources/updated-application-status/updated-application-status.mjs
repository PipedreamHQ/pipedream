import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "homerun-updated-application-status",
  name: "New Application Status Update",
  description: "Emit new event when the status of a job application is updated. [See the documentation](https://developers.homerun.co/#tag/Job-Applications/operation/job-applications.index).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "updated_at";
    },
    getResourceName() {
      return "data";
    },
    getResourcesFn() {
      return this.app.listJobApplications;
    },
    getResourcesFnArgs() {
      return {};
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Aplication Status Changed: ${resource.id}`,
        ts: Date.parse(resource.updated_at),
      };
    },
  },
  sampleEmit,
};
