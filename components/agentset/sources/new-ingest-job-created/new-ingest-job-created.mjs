import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "agentset-new-ingest-job-created",
  name: "New Ingest Job Created",
  description: "Emit new event when a ingest job is created. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/ingest-jobs/list)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.agentset.listIngestJobs;
    },
    getSummary(item) {
      return `New ingest job created (${item.id})`;
    },
  },
  sampleEmit,
};
