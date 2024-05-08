import { axios } from "@pipedream/platform";
import greenhouse from "../../greenhouse.app.mjs";

export default {
  key: "greenhouse-watch-candidates",
  name: "Watch Candidates",
  description: "Emits an event when a candidate's application or status changes. [See the documentation](https://developers.greenhouse.io/harvest.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    greenhouse,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 3600, // runs every 1 hour
      },
    },
    candidateId: {
      propDefinition: [
        greenhouse,
        "candidateId",
      ],
    },
  },
  methods: {
    ...greenhouse.methods,
  },
  hooks: {
    async deploy() {
      // This is a placeholder for any deployment logic, like fetching historical data
    },
  },
  async run() {
    const lastChecked = this.db.get("lastChecked") || new Date().toISOString();
    const applications = await this.greenhouse._makeRequest({
      path: `/candidates/${this.candidateId}/applications`,
      params: {
        created_after: lastChecked,
      },
    });

    applications.forEach((application) => {
      this.$emit(application, {
        id: application.id,
        summary: `New application status for candidate ID ${this.candidateId}: ${application.status}`,
        ts: Date.parse(application.applied_at),
      });
    });

    // Update lastChecked time
    this.db.set("lastChecked", new Date().toISOString());
  },
};
