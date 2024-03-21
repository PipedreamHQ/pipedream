import betterStackApp from "../../better_stack.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "better_stack-resolve-incident",
  name: "Resolve Incident",
  description: "Brings a closure to an incident by resolving it with optional resolution details. [See the documentation](https://betterstack.com/docs/uptime/api/resolve-an-ongoing-incident/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    betterStackApp,
    incidentId: {
      propDefinition: [
        betterStackApp,
        "incidentId",
      ],
    },
    resolutionDetails: {
      propDefinition: [
        betterStackApp,
        "resolutionDetails",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.betterStackApp.resolveIncident({
      incidentId: this.incidentId,
      resolutionDetails: this.resolutionDetails || {},
    });

    $.export("$summary", `Successfully resolved incident with ID ${this.incidentId}`);
    return response;
  },
};
