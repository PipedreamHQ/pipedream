import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "qntrl-new-job-created",
  name: "New Job Created",
  description: "Emit new event when a job is created. [See the documentation](https://core.qntrl.com/apidoc.html?type=reference&module=jobs&action=getAllJobs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  sampleEmit,
  methods: {
    ...common.methods,
    getSummary(job) {
      return `New Job: "${job.title}"`;
    },
    sortItems(a, b) {
      return new Date(a.created_date_utc).valueOf() - new Date(b.created_date_utc).valueOf();
    },
    getItems() {
      return this.app.listJobs(this.orgId);
    },
  },
};
