import common from "../common/common.mjs";

export default {
  ...common,
  key: "qntrl-new-job-created",
  name: "New Job Created",
  description: "Emit new event when a job is created. [See the documentation](https://core.qntrl.com/apidoc.html?type=reference&module=jobs&action=getAllJobs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(job) {
      return `New Job: "${job.title}"`;
    },
    getItems() {
      return this.qntrl.listJobs(this.orgId);
    },
  },
};
