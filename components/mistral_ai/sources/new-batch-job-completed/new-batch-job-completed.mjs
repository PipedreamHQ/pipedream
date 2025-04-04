import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "mistral_ai-new-batch-job-completed",
  name: "New Batch Job Completed",
  description: "Emit new event when a new batch job is completed. [See the Documentation](https://docs.mistral.ai/api/#tag/batch/operation/jobs_api_routes_batch_get_batch_jobs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    status: {
      type: "string",
      label: "Status",
      description: "Filter the results by the batch job status",
      options: constants.BATCH_JOB_STATUS_OPTIONS,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.mistralAI.listBatchJobs;
    },
    getParams() {
      return {
        status: this.status,
        created_after: this._getLastTs(),
      };
    },
    generateMeta(job) {
      return {
        id: job.id,
        summary: `New Batch Job ${job.status} with ID: ${job.id}`,
        ts: job.created_at,
      };
    },
  },
};
