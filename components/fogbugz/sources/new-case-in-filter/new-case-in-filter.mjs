import { axios } from "@pipedream/platform";
import fogbugz from "../../fogbugz.app.mjs";

export default {
  key: "fogbugz-new-case-in-filter",
  name: "New Case in Filter",
  description: "Emits a new event when there's a new case under a specified filter. Note this may not effectively work for filters that generate results too long, or filters with more than 50,000 cases, especially if your FogBugz site is running Ocelot. [See the documentation](https://api.manuscript.com/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    fogbugz,
    db: "$.service.db",
    filterId: {
      propDefinition: [
        fogbugz,
        "filterId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    async fetchAndEmitCases() {
      const lastCaseNumber = this.db.get("lastCaseNumber") || 0;
      let maxCaseNumber = lastCaseNumber;

      const response = await this.fogbugz._makeRequest({
        method: "POST",
        path: "/api/search",
        data: {
          q: `filter:${this.filterId}`,
          cols: [
            "ixBug",
            "sTitle",
            "events",
          ],
        },
      });

      const newCases = response.cases.filter((caseItem) => caseItem.ixBug > lastCaseNumber);
      for (const caseItem of newCases) {
        this.$emit(caseItem, {
          id: caseItem.ixBug.toString(),
          summary: `New Case: ${caseItem.sTitle}`,
          ts: Date.now(),
        });
        maxCaseNumber = Math.max(maxCaseNumber, caseItem.ixBug);
      }

      this.db.set("lastCaseNumber", maxCaseNumber);
    },
  },
  async run() {
    await this.fetchAndEmitCases();
  },
};
