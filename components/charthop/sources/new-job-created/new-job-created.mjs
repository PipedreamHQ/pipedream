import common from "../common/base.mjs";

export default {
  ...common,
  key: "charthop-new-job-created",
  name: "New Job Created",
  description: "Emit new event when a new job is added to the organization. [See the documentation](https://api.charthop.com/swagger#/job/findJobs)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.charthop.listJobs;
    },
    getSummary(item) {
      return `New Job: ${item.id}`;
    },
  },
};
