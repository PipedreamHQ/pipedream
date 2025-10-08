import leaddyno from "../../leaddyno.app.mjs";

export default {
  key: "leaddyno-retrieve-lead",
  name: "Retrieve Lead",
  description: "Retrieves information about a lead from LeadDyno. [See the documentation](https://app.theneo.io/leaddyno/leaddyno-rest-api/leads/retrieve-a-lead-by-id)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    leaddyno,
    leadId: {
      propDefinition: [
        leaddyno,
        "leadId",
      ],
      description: "The ID of the lead to retrieve",
    },
  },
  async run({ $ }) {
    const response = await this.leaddyno.getLead({
      $,
      leadId: this.leadId,
    });

    $.export("$summary", `Successfully retrieved lead with ID ${this.leadId}`);
    return response;
  },
};
