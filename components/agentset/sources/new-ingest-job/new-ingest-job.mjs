import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "agentset-new-ingest-job",
  name: "New Ingest Job Status",
  description: "Emit new event when a new ingest job status is updated. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/ingest-jobs/list)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.agentset.listIngestJobs;
    },
    getSummary(item) {
      return `New Ingest Job: ${item.id}`;
    },
  },
  sampleEmit,
};
