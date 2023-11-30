import zamzar from "../../zamzar.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "zamzar-new-conversion-job",
  name: "New Conversion Job",
  description: "Emits a new event when a conversion job has completed. [See the documentation](https://developers.zamzar.com/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    zamzar,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    jobSource: {
      propDefinition: [
        zamzar,
        "jobSource",
      ],
    },
  },
  methods: {
    _getLastCheckedJobId() {
      return this.db.get("lastCheckedJobId") || 0;
    },
    _setLastCheckedJobId(jobId) {
      this.db.set("lastCheckedJobId", jobId);
    },
  },
  hooks: {
    async deploy() {
      let lastCheckedJobId = this._getLastCheckedJobId();
      const jobs = [];
      let hasMore = true;

      while (hasMore) {
        const response = await this.zamzar.getJobStatus({
          jobId: lastCheckedJobId,
        });
        jobs.push(...response.jobs);
        hasMore = response.pagination.next
          ? true
          : false;
        lastCheckedJobId = response.pagination.next;
      }

      const recentJobs = jobs.slice(-50).reverse();
      for (const job of recentJobs) {
        if (job.status === "successful") {
          this.$emit(job, {
            id: job.id,
            summary: `Job ${job.id} has completed`,
            ts: Date.parse(job.finished_at),
          });
        }
      }

      if (recentJobs.length) {
        this._setLastCheckedJobId(recentJobs[recentJobs.length - 1].id);
      }
    },
  },
  async run() {
    const lastCheckedJobId = this._getLastCheckedJobId();
    const response = await this.zamzar.getJobStatus({
      jobId: lastCheckedJobId,
    });

    for (const job of response.jobs) {
      if (job.status === "successful" && job.id > lastCheckedJobId) {
        this.$emit(job, {
          id: job.id,
          summary: `Job ${job.id} has completed`,
          ts: Date.parse(job.finished_at),
        });
      }
    }

    if (response.jobs.length) {
      const maxJobId = Math.max(...response.jobs.map((job) => job.id));
      this._setLastCheckedJobId(maxJobId);
    }
  },
};
