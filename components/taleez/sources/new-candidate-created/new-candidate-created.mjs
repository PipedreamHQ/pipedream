import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import taleez from "../../taleez.app.mjs";

export default {
  key: "taleez-new-candidate-created",
  name: "New Candidate Created",
  description: "Emit new event when a candidate is added to a job listing. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    taleez: {
      type: "app",
      app: "taleez",
    },
    jobListingId: {
      propDefinition: [
        "taleez",
        "jobListingId",
      ],
    },
    departmentFilter: {
      propDefinition: [
        "taleez",
        "departmentFilter",
      ],
      optional: true,
    },
    locationFilter: {
      propDefinition: [
        "taleez",
        "locationFilter",
      ],
      optional: true,
    },
    db: {
      type: "$.service.db",
      db: "default",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const candidates = await this.taleez.paginate(this.taleez.listCandidates, {
        params: {
          job_listing_id: this.jobListingId,
          department: this.departmentFilter,
          location: this.locationFilter,
          per_page: 50,
        },
      });

      const sortedCandidates = candidates.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      for (const candidate of sortedCandidates) {
        this.$emit(
          candidate,
          {
            id: candidate.id || new Date(candidate.created_at).getTime(),
            summary: `New Candidate: ${candidate.name}`,
            ts: new Date(candidate.created_at).getTime(),
          },
        );
      }

      if (candidates.length > 0) {
        const latestTimestamp = new Date(candidates[candidates.length - 1].created_at).getTime();
        await this.db.set("lastRunTimestamp", latestTimestamp);
      }
    },
    async activate() {
      // No webhook subscription needed for polling source
    },
    async deactivate() {
      // No webhook subscription to clean up for polling source
    },
  },
  async run() {
    const lastRunTimestamp = await this.db.get("lastRunTimestamp") || 0;

    const candidates = await this.taleez.paginate(this.taleez.listCandidates, {
      params: {
        job_listing_id: this.jobListingId,
        department: this.departmentFilter,
        location: this.locationFilter,
        per_page: 50,
      },
    });

    const newCandidates = candidates.filter((candidate) => new Date(candidate.created_at).getTime() > lastRunTimestamp);

    const sortedNewCandidates = newCandidates.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    for (const candidate of sortedNewCandidates) {
      this.$emit(
        candidate,
        {
          id: candidate.id || new Date(candidate.created_at).getTime(),
          summary: `New Candidate: ${candidate.name}`,
          ts: new Date(candidate.created_at).getTime(),
        },
      );
    }

    if (sortedNewCandidates.length > 0) {
      const latestTimestamp = new Date(sortedNewCandidates[sortedNewCandidates.length - 1].created_at).getTime();
      await this.db.set("lastRunTimestamp", latestTimestamp);
    }
  },
};
