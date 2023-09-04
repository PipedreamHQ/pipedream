import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "streamtime-new-job-created",
  name: "New Job Created",
  description: "Emit new event when a new job is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(job) {
      return {
        id: job.id,
        summary: job.name,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const results = await this.getPaginatedResults(this.streamtime.listJobs, {
      data: {
        ...constants.JOB_SEARCH_BASE_PARAMS,
        sortField: 1,
        sortAscending: false,
      },
    });
    results.reverse().forEach((item) => this.emitEvent(item));
  },
};
