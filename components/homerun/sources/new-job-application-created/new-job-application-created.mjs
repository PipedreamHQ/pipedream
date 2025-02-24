import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "homerun-new-job-application-created",
  name: "New Job Application Created",
  description: "Emit new event when a candidate submits an application for a job posting. [See the documentation](https://developers.homerun.co/#tag/Job-Applications/operation/job-applications.index).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "created_at";
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
        summary: `New Job Application: ${resource.personal_info.email}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  sampleEmit,
};
