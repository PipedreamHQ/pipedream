import taleez from "../../taleez.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "taleez-new-job-listed",
  name: "New Job Listing Created",
  description: "Emit a new event when a job listing is created. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    taleez,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    departmentFilter: {
      propDefinition: [
        taleez,
        "departmentFilter",
      ],
      optional: true,
    },
    locationFilter: {
      propDefinition: [
        taleez,
        "locationFilter",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const jobListings = await this.taleez.listJobListings({
        params: {
          perpage: 50,
          sort: "created_desc",
          department: this.departmentFilter,
          location: this.locationFilter,
        },
      });

      // Sort from oldest to newest
      jobListings.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      for (const job of jobListings) {
        this.$emit(job, {
          id: job.id,
          summary: `New Job Listing: ${job.title}`,
          ts: Date.parse(job.created_at) || Date.now(),
        });
      }

      if (jobListings.length > 0) {
        const latestTs = Math.max(...jobListings.map((j) => Date.parse(j.created_at) || Date.now()));
        await this.db.set("last_seen_ts", latestTs);
      }
    },
    async activate() {
      await this.taleez.emitNewJobListingEvent(this.callbackUrl);
    },
    async deactivate() {
      await this.taleez.removeWebhook("job_listing_created");
    },
  },
  async run() {
    const lastSeenTs = (await this.db.get("last_seen_ts")) || 0;
    const jobListings = await this.taleez.listJobListings({
      params: {
        perpage: 100,
        sort: "created_asc",
        department: this.departmentFilter,
        location: this.locationFilter,
      },
    });

    const newJobListings = jobListings.filter((job) => Date.parse(job.created_at) > lastSeenTs);

    // Sort from oldest to newest
    newJobListings.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    for (const job of newJobListings) {
      this.$emit(job, {
        id: job.id,
        summary: `New Job Listing: ${job.title}`,
        ts: Date.parse(job.created_at) || Date.now(),
      });
    }

    if (newJobListings.length > 0) {
      const latestTs = Math.max(...newJobListings.map((j) => Date.parse(j.created_at) || Date.now()));
      await this.db.set("last_seen_ts", latestTs);
    }
  },
};
