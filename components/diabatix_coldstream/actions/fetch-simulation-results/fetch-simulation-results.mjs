import coldstream from "../../diabatix_coldstream.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "diabatix_coldstream-fetch-simulation-results",
  name: "Fetch Simulation Results",
  description: "Retrieves the result of a specific thermal simulation from ColdStream. [See the documentation](https://api.coldstream.diabatix.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    coldstream,
    projectId: {
      propDefinition: [
        coldstream,
        "projectId",
      ],
    },
    caseId: {
      propDefinition: [
        coldstream,
        "caseId",
      ],
    },
  },
  async run({ $ }) {
    if (!this.projectId || !this.caseId) {
      throw new Error("Project ID and Case ID are required.");
    }

    const response = await this.coldstream.getCaseResults({
      caseId: this.caseId,
    });
    $.export("$summary", `Successfully retrieved simulation results for case ID ${this.caseId}`);
    return response;
  },
};
