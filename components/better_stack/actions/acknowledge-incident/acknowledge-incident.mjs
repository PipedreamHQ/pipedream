import betterStackApp from "../../better_stack.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "better_stack-acknowledge-incident",
  name: "Acknowledge Incident",
  description: "Acknowledges an incident, marking it as acknowledged in Better Stack. [See the documentation](https://betterstack.com/docs/uptime/api/acknowledge-an-ongoing-incident/)",
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
  },
  async run({ $ }) {
    const response = await this.betterStackApp.acknowledgeIncident({
      incidentId: this.incidentId,
    });

    $.export("$summary", `Acknowledged incident with ID: ${this.incidentId}`);
    return response;
  },
};
