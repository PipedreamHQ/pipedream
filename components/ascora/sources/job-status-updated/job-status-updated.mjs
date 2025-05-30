import ascora from "../../ascora.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "ascora-job-status-updated",
  name: "Job Status Updated in Ascora",
  description: "Emits an event whenever a job's status changes in Ascora. [See the documentation](https://support.ascora.com.au/display/AS/API+Endpoints)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ascora,
    db: "$.service.db",
    jobId: {
      propDefinition: [
        ascora,
        "jobId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    ...ascora.methods,
    async getJobStatus(jobId) {
      return this.ascora._makeRequest({
        path: `/jobs/${jobId}`,
      });
    },
    getStoredJobStatus() {
      return this.db.get("jobStatus") || {};
    },
    storeJobStatus(jobStatus) {
      this.db.set("jobStatus", jobStatus);
    },
  },
  hooks: {
    async deploy() {
      // Fetch the current job status to initialize the state
      const currentStatus = await this.getJobStatus(this.jobId);
      this.storeJobStatus(currentStatus);
    },
  },
  async run() {
    const storedJobStatus = this.getStoredJobStatus();
    const currentStatus = await this.getJobStatus(this.jobId);

    if (currentStatus.status !== storedJobStatus.status) {
      this.$emit(currentStatus, {
        id: currentStatus.id,
        summary: `Job status updated to ${currentStatus.status}`,
        ts: Date.parse(currentStatus.updated_at) || Date.now(),
      });
      this.storeJobStatus(currentStatus);
    }
  },
};
