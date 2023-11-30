import zamzar from "../../zamzar.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "zamzar-watch-completed-conversion-jobs",
  name: "Watch Completed Conversion Jobs",
  description: "Emits an event as soon as a conversion job has been completed. [See the documentation](https://developers.zamzar.com/docs)",
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
    jobState: {
      propDefinition: [
        zamzar,
        "jobState",
      ],
    },
  },
  methods: {
    _getLastChecked() {
      return this.db.get("lastChecked") || 0;
    },
    _setLastChecked(lastChecked) {
      this.db.set("lastChecked", lastChecked);
    },
  },
  hooks: {
    async deploy() {
      // Emit the most recent 50 completed jobs
      const lastChecked = this._getLastChecked();
      let page = 1;
      let totalEmitted = 0;
      const limit = 50;

      while (totalEmitted < limit) {
        const response = await this.zamzar.getJobStatus({
          status: "successful",
          after: lastChecked,
          page: page,
        });

        if (!response || response.length === 0) {
          break;
        }

        for (const job of response.jobs) {
          this.$emit(job, {
            id: job.id,
            summary: `Completed Job ID: ${job.id}`,
            ts: Date.parse(job.finished_at),
          });
          totalEmitted++;
          if (totalEmitted >= limit) {
            break;
          }
        }

        if (response.jobs.length === 0) {
          break;
        }

        page++;
      }

      if (response && response.jobs && response.jobs.length > 0) {
        const lastJob = response.jobs[response.jobs.length - 1];
        this._setLastChecked(lastJob.finished_at);
      }
    },
  },
  async run() {
    const lastChecked = this._getLastChecked();
    let page = 1;

    while (true) {
      const response = await this.zamzar.getJobStatus({
        status: "successful",
        after: lastChecked,
        page: page,
      });

      if (!response || response.length === 0) {
        break;
      }

      for (const job of response.jobs) {
        this.$emit(job, {
          id: job.id,
          summary: `Completed Job ID: ${job.id}`,
          ts: Date.parse(job.finished_at),
        });
      }

      const lastJob = response.jobs[response.jobs.length - 1];
      this._setLastChecked(lastJob.finished_at);

      if (!response.paging || response.paging.last === page) {
        break;
      }

      page++;
    }
  },
};
