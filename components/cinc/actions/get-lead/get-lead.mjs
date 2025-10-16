import cinc from "../../cinc.app.mjs";

export default {
  key: "cinc-get-lead",
  name: "Get Lead",
  description: "Retrieves a lead by ID in CINC. [See the documentation](https://public.cincapi.com/v2/docs/#get-site-leads-lead_id-2)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cinc,
    leadId: {
      propDefinition: [
        cinc,
        "leadId",
      ],
    },
  },
  async run({ $ }) {
    const { lead } = await this.cinc.getLead({
      $,
      leadId: this.leadId,
    });
    $.export("$summary", `Successfully retrieved lead with ID ${this.leadId}`);
    return lead;
  },
};
