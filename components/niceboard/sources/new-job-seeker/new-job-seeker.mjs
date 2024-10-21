import niceboard from "../../niceboard.app.mjs";

export default {
  key: "niceboard-new-job-seeker",
  name: "New Job Seeker",
  description: "Emits an event when a new job seeker account is registered",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    niceboard: {
      type: "app",
      app: "niceboard",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    jobSeekerId: {
      propDefinition: [
        niceboard,
        "jobSeekerId",
      ],
    },
    jobSeekerDetails: {
      propDefinition: [
        niceboard,
        "jobSeekerDetails",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Fetch all job seekers
      const jobSeekers = await this.niceboard.getJobSeekers();
      // Emit the last 50 job seekers
      for (const jobSeeker of jobSeekers.slice(0, 50)) {
        this.$emit(jobSeeker, {
          id: jobSeeker.id,
          summary: `New Job Seeker: ${jobSeeker.id}`,
          ts: Date.now(),
        });
      }
    },
  },
  async run() {
    // Fetch all job seekers
    const jobSeekers = await this.niceboard.getJobSeekers();
    // Emit each new job seeker
    for (const jobSeeker of jobSeekers) {
      // Check if the job seeker is new
      if (jobSeeker.id !== this.jobSeekerId) {
        this.$emit(jobSeeker, {
          id: jobSeeker.id,
          summary: `New Job Seeker: ${jobSeeker.id}`,
          ts: Date.now(),
        });
      }
    }
  },
};
