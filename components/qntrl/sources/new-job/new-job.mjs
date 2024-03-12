import qntrl from "../../qntrl.app.mjs";

export default {
  key: "qntrl-new-job",
  name: "New Job Created",
  description: "Emit new event when a job is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    qntrl,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    jobCreatorId: {
      propDefinition: [
        qntrl,
        "jobCreatorId",
      ],
    },
    description: {
      propDefinition: [
        qntrl,
        "description",
        (c) => ({
          jobCreatorId: c.jobCreatorId,
        }),
      ],
      optional: true,
    },
    deadline: {
      type: "string",
      label: "Deadline",
      description: "The deadline for the job completion. Format: YYYY-MM-DD",
      optional: true,
    },
  },
  methods: {
    ...qntrl.methods,
    async fetchJobs() {
      const response = await this.qntrl._makeRequest({
        path: "/jobs",
        method: "GET",
        params: {
          jobCreatorId: this.jobCreatorId,
          description: this.description,
          deadline: this.deadline,
        },
      });
      return response;
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit historical data during deployment
      const jobs = await this.fetchJobs();
      jobs.forEach((job) => {
        this.$emit(job, {
          id: job.id,
          summary: `New Job: ${job.title}`,
          ts: Date.parse(job.created_time),
        });
      });
    },
  },
  async run() {
    const jobs = await this.fetchJobs();
    jobs.forEach((job) => {
      this.$emit(job, {
        id: job.id,
        summary: `New Job: ${job.title}`,
        ts: Date.parse(job.created_time),
      });
    });
  },
};
