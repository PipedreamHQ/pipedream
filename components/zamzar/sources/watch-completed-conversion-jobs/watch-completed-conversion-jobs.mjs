import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zamzar-watch-completed-conversion-jobs",
  name: "Watch Completed Conversion Jobs",
  description: "Emit new event as soon as a conversion job has been completed. [See the documentation](https://developers.zamzar.com/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "greatest",
  methods: {
    ...common.methods,
    processLastResource(resource) {
      this.setCursor(resource.id);
    },
    isResourceRelevant(resource) {
      return resource.status === "successful";
    },
    getListResourcesFn() {
      return this.app.listJobs;
    },
    getListResourcesFnArgs() {
      return {
        params: {
          before: this.getCursor(),
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `Completed Job: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  sampleEmit,
};
