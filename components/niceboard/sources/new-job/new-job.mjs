import niceboard from "../../niceboard.app.mjs";

export default {
  key: "niceboard-new-job",
  name: "New Job Published",
  description: "Emits an event each time a new job is published in Niceboard",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    niceboard,
    jobId: {
      propDefinition: [
        niceboard,
        "jobId",
      ],
    },
    employerId: {
      propDefinition: [
        niceboard,
        "employerId",
      ],
    },
    jobDetails: {
      propDefinition: [
        niceboard,
        "jobDetails",
      ],
    },
    employerDetails: {
      propDefinition: [
        niceboard,
        "employerDetails",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    db: "$.service.db",
  },
  methods: {
    _getJobId() {
      return this.db.get("jobId") || null;
    },
    _setJobId(jobId) {
      this.db.set("jobId", jobId);
    },
  },
  async run() {
    let lastJobId = this._getJobId();
    let hasMore = true;
    while (hasMore) {
      const jobs = await this.niceboard.getJobs({
        jobId: lastJobId,
      });
      hasMore = jobs.length > 0;
      for (const job of jobs) {
        if (job.id !== lastJobId) {
          this.$emit(job, {
            id: job.id,
            summary: job.title,
            ts: Date.now(),
          });
        } else {
          hasMore = false;
        }
        lastJobId = job.id;
      }
    }
    this._setJobId(lastJobId);
  },
};
