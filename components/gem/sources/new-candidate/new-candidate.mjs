import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import gem from "../../gem.app.mjs";

export default {
  key: "gem-new-candidate",
  name: "New Candidate Added",
  description: "Emit a new event when a candidate is added in Gem. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    gem: {
      type: "app",
      app: "gem",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    filterJobPositions: {
      propDefinition: [
        "gem",
        "filterJobPositions",
      ],
    },
    filterRecruiters: {
      propDefinition: [
        "gem",
        "filterRecruiters",
      ],
    },
  },
  hooks: {
    async deploy() {
      const pageSize = 50;
      let page = 1;
      let candidates = [];
      let more = true;

      while (more && candidates.length < pageSize) {
        const fetchedCandidates = await this.gem.listCandidates({
          page,
          perPage: pageSize,
        });
        if (fetchedCandidates.length === 0) {
          more = false;
        } else {
          candidates.push(...fetchedCandidates);
          if (fetchedCandidates.length < pageSize) {
            more = false;
          } else {
            page += 1;
          }
        }
      }

      const recentCandidates = candidates.slice(0, pageSize);
      for (const candidate of recentCandidates) {
        this.$emit(
          candidate,
          {
            id: candidate.id,
            summary: `New Candidate: ${candidate.first_name} ${candidate.last_name}`,
            ts: new Date(candidate.created_at).getTime(),
          },
        );
      }

      if (recentCandidates.length > 0) {
        const latestTimestamp = new Date(recentCandidates[0].created_at).getTime();
        await this.db.set("lastTimestamp", latestTimestamp);
      }
    },
    async activate() {
      // No webhook subscription needed for polling source
    },
    async deactivate() {
      // No webhook subscription to remove for polling source
    },
  },
  async run() {
    const lastTimestamp = (await this.db.get("lastTimestamp")) || 0;
    let page = 1;
    const newCandidates = [];
    let more = true;
    const pageSize = 50;

    while (more && newCandidates.length < pageSize) {
      const fetchedCandidates = await this.gem.listCandidates({
        page,
        perPage: pageSize,
        createdAfter: lastTimestamp,
        job_position_ids: this.filterJobPositions || [],
        recruiter_ids: this.filterRecruiters || [],
      });
      if (fetchedCandidates.length === 0) {
        more = false;
      } else {
        for (const candidate of fetchedCandidates) {
          const candidateTimestamp = new Date(candidate.created_at).getTime();
          if (candidateTimestamp > lastTimestamp) {
            newCandidates.push(candidate);
            if (newCandidates.length >= pageSize) {
              break;
            }
          }
        }
        if (fetchedCandidates.length < pageSize) {
          more = false;
        } else {
          page += 1;
        }
      }
    }

    for (const candidate of newCandidates) {
      this.$emit(
        candidate,
        {
          id: candidate.id,
          summary: `New Candidate: ${candidate.first_name} ${candidate.last_name}`,
          ts: new Date(candidate.created_at).getTime(),
        },
      );
    }

    if (newCandidates.length > 0) {
      const latestTimestamp = newCandidates.reduce((max, candidate) => {
        const candidateTime = new Date(candidate.created_at).getTime();
        return candidateTime > max
          ? candidateTime
          : max;
      }, lastTimestamp);
      await this.db.set("lastTimestamp", latestTimestamp);
    }
  },
};
