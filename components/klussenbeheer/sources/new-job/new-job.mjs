import klussenbeheer from "../../klussenbeheer.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

const DEPLOY_LIMIT = 10;

export default {
  key: "klussenbeheer-new-job",
  name: "New Job",
  description: "Emit new event when a new job appears in Klussenbeheer. On the first run, the most recent jobs are emitted so the workflow has events to work with right away.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    klussenbeheer,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const jobs = await this.klussenbeheer.searchJobs(null, {
        limit: DEPLOY_LIMIT,
      });
      this.emitJobs(jobs);
    },
  },
  methods: {
    emitJobs(jobs) {
      [
        ...jobs,
      ].reverse().forEach((job) => {
        const ts = Date.parse(job.updated_at ?? "");
        this.$emit(job, {
          id: job.id,
          summary: job.title ?? `Job #${job.id}`,
          ts: Number.isNaN(ts)
            ? undefined
            : ts,
        });
      });
    },
  },
  async run() {
    const jobs = await this.klussenbeheer.searchJobs(null, {
      limit: 25,
    });
    this.emitJobs(jobs);
  },
};
