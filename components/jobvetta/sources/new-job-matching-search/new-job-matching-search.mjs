import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../jobvetta.app.mjs";

export default {
  key: "jobvetta-new-job-matching-search",
  name: "New Job Matching Search",
  description: "Emit new event when a verified employer career-site job posting matches your search filters. [See the documentation](https://www.jobvetta.com/api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    q: {
      propDefinition: [
        app,
        "q",
      ],
      optional: true,
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    remote: {
      propDefinition: [
        app,
        "remote",
      ],
    },
  },
  methods: {
    async emitJobs(limit = 25) {
      const { jobs = [] } = await this.app.searchJobs({
        remote: this.remote,
        params: {
          q: this.q,
          location: this.location,
          days: 7,
          limit,
        },
      });
      for (const job of [
        ...jobs,
      ].reverse()) {
        this.$emit(job, {
          id: job.job_id,
          summary: `${job.title} at ${job.company}`,
          ts: Date.now(),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitJobs(10);
    },
  },
  async run() {
    await this.emitJobs(25);
  },
};
