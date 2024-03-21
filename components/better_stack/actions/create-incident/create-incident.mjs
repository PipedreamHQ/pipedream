import betterStackApp from "../../better_stack.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "better_stack-create-incident",
  name: "Create Incident",
  description: "Initiates an incident that signals the team. [See the documentation](https://betterstack.com/docs/uptime/api/create-a-new-incident/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    betterStackApp,
    description: {
      propDefinition: [
        betterStackApp,
        "description",
      ],
    },
    priority: {
      propDefinition: [
        betterStackApp,
        "priority",
      ],
    },
    notificationSettings: {
      propDefinition: [
        betterStackApp,
        "notificationSettings",
      ],
      optional: true,
    },
    additionalDetails: {
      propDefinition: [
        betterStackApp,
        "additionalDetails",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.betterStackApp.createIncident({
      description: this.description,
      priority: this.priority,
      notificationSettings: this.notificationSettings,
      additionalDetails: this.additionalDetails,
    });

    $.export("$summary", `Successfully created incident with priority ${this.priority}`);
    return response;
  },
};
