import { axios } from "@pipedream/platform";
import greenhouse from "../../greenhouse.app.mjs";

export default {
  key: "greenhouse-new-candidate-application",
  name: "New Candidate Application",
  description: "Emits a new event when a candidate submits a new application. [See the documentation](https://developers.greenhouse.io/harvest.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    greenhouse,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    applicationDetails: {
      propDefinition: [
        greenhouse,
        "applicationDetails",
      ],
    },
  },
  methods: {
    ...greenhouse.methods,
    async fetchAndEmitApplications() {
      const lastRun = this.db.get("lastRun") || new Date().toISOString();
      // Assuming the method to fetch new applications by last run timestamp exists
      const applications = await this.greenhouse.getNewApplications({
        since: lastRun,
      });
      applications.forEach((application) => {
        this.$emit(application, {
          id: application.id.toString(),
          summary: `New application from candidate ${application.candidateId}`,
          ts: Date.parse(application.appliedAt),
        });
      });
      this.db.set("lastRun", new Date().toISOString());
    },
  },
  hooks: {
    async deploy() {
      // Emit existing applications on deploy
      await this.fetchAndEmitApplications();
    },
  },
  async run() {
    await this.fetchAndEmitApplications();
  },
};
