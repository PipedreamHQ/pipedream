import common from "../common/base.mjs";

export default {
  ...common,
  key: "mistral_ai-new-batch-job-failure",
  name: "New Batch Job Failure",
  description: "Emit new event when a new batch job fails. [See the Documentation](https://docs.mistral.ai/api/#tag/batch/operation/jobs_api_routes_batch_get_batch_jobs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.mistralAI.listBatchJobs;
    },
    getParams() {
      return {
        status: "FAILED",
        created_after: this._getLastTs(),
      };
    },
    generateMeta(job) {
      return {
        id: job.id,
        summary: `New Batch Job Failed with ID: ${job.id}`,
        ts: job.created_at,
      };
    },
  },
};
