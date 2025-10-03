import ascora from "../../ascora.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ascora-new-job-created",
  name: "New Job Created in Ascora",
  description: "Emits an event whenever a new job is created in Ascora.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ascora,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getLastJobId() {
      return this.db.get("lastJobId") || null;
    },
    _setLastJobId(lastJobId) {
      this.db.set("lastJobId", lastJobId);
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit jobs created before the source was deployed (historical data)
      let hasMore = true;
      let page = 1;
      let lastJobId = this._getLastJobId();

      while (hasMore) {
        const response = await this.ascora._makeRequest({
          path: "/jobs",
          params: {
            page,
            per_page: 50,
          },
        });

        for (const job of response.jobs) {
          if (job.id === lastJobId) {
            hasMore = false;
            break;
          }
          this.$emit(job, {
            id: job.id,
            summary: `New job: ${job.title}`,
            ts: Date.parse(job.created_at),
          });
        }

        if (response.jobs.length < 50) {
          hasMore = false;
        } else {
          page++;
        }
      }

      if (response.jobs.length > 0) {
        this._setLastJobId(response.jobs[0].id);
      }
    },
  },
  async run() {
    // Fetch and emit new jobs created since the last check
    let hasMore = true;
    let page = 1;
    let lastJobId = this._getLastJobId();

    while (hasMore) {
      const response = await this.ascora._makeRequest({
        path: "/jobs",
        params: {
          page,
          per_page: 50,
        },
      });

      for (const job of response.jobs) {
        if (job.id === lastJobId) {
          hasMore = false;
          break;
        }
        this.$emit(job, {
          id: job.id,
          summary: `New job: ${job.title}`,
          ts: Date.parse(job.created_at),
        });
      }

      if (response.jobs.length < 50) {
        hasMore = false;
      } else {
        page++;
      }
    }

    if (response.jobs.length > 0) {
      this._setLastJobId(response.jobs[0].id);
    }
  },
};
