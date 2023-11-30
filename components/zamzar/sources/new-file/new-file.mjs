import zamzar from "../../zamzar.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "zamzar-new-file",
  name: "New File",
  description: "Emits an event when a file has been converted successfully. [See the documentation](https://developers.zamzar.com/docs)",
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
    fileType: {
      propDefinition: [
        zamzar,
        "fileType",
      ],
    },
  },
  methods: {
    _getAfter() {
      return this.db.get("after") || new Date().toISOString();
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
  },
  hooks: {
    async deploy() {
      // Fetch jobs created after this time
      const after = this._getAfter();
      let jobs = [];
      let page = 1;
      let totalFetched = 0;

      while (true) {
        const response = await this.zamzar.getJobStatus({
          status: "successful",
          after: after,
          page: page,
        });
        jobs = [
          ...jobs,
          ...response.jobs,
        ];
        totalFetched += response.jobs.length;
        if (response.pagination.total_count <= totalFetched || response.jobs.length === 0) {
          break;
        }
        page++;
      }

      const toEmit = jobs.slice(-50).reverse();
      for (const job of toEmit) {
        this.$emit(job, {
          id: job.id,
          summary: `New file converted: ${job.target_files.map((file) => file.name).join(", ")}`,
          ts: Date.parse(job.finished_at),
        });
      }

      if (toEmit.length > 0) {
        const lastFinishedAt = toEmit[0].finished_at;
        this._setAfter(lastFinishedAt);
      }
    },
  },
  async run() {
    const after = this._getAfter();
    let jobs = [];
    let page = 1;
    let totalFetched = 0;

    while (true) {
      const response = await this.zamzar.getJobStatus({
        status: "successful",
        after: after,
        page: page,
      });
      jobs = [
        ...jobs,
        ...response.jobs,
      ];
      totalFetched += response.jobs.length;
      if (response.pagination.total_count <= totalFetched || response.jobs.length === 0) {
        break;
      }
      page++;
    }

    for (const job of jobs) {
      this.$emit(job, {
        id: job.id,
        summary: `New file converted: ${job.target_files.map((file) => file.name).join(", ")}`,
        ts: Date.parse(job.finished_at),
      });
    }

    if (jobs.length > 0) {
      const lastFinishedAt = jobs[0].finished_at;
      this._setAfter(lastFinishedAt);
    }
  },
};
