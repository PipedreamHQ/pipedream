import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "agentset-ingest-job-status-updated",
  name: "Ingest Job Status Updated",
  description: "Emit new event when a ingest job status is updated. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/ingest-jobs/list)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.agentset.listIngestJobs;
    },
    getSummary(item) {
      return `Ingest Job (${item.id}) has a new status: ${item.status}`;
    },
  },
  sampleEmit,
};
