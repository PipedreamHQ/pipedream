import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-get-lead",
  name: "Get Lead",
  description: "Retrieve a single lead from Nutshell. [See the documentation](https://developers.nutshell.com/reference/8e55836889bb7d432d5fe3d9bfe608b7)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nutshell,
    leadId: {
      propDefinition: [
        nutshell,
        "leadId",
      ],
    },
  },
  async run({ $ }) {
    const lead = await this.nutshell.getLead({
      $,
      leadId: this.leadId,
    });

    $.export("$summary", `Successfully retrieved lead (ID: ${lead?.id ?? this.leadId})`);
    return this.nutshell.formatLead(lead);
  },
};
