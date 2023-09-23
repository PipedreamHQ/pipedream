import common from "../common/common.mjs";

export default {
  ...common,
  key: "workiz-new-job-created",
  name: "New Job Created",
  description: "Emit new event when a new job is created in Workiz. [See the documentation](https://developer.workiz.com/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.workiz.listJobs;
    },
    generateMeta(job) {
      return {
        id: job.UUID,
        summary: `New Job ${job.UUID}`,
        ts: Date.parse(job.CreatedDate),
      };
    },
  },
};
