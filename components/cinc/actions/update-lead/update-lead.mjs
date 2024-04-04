import cinc from "../../cinc.app.mjs";

export default {
  key: "cinc-update-lead",
  name: "Update Lead",
  description: "Updates an existing lead data in CINC",
  version: "0.0.1",
  type: "action",
  props: {
    cinc,
    leadId: {
      propDefinition: [
        cinc,
        "leadIdentifier",
      ],
    },
    fieldsToUpdate: {
      propDefinition: [
        cinc,
        "fieldsToUpdate",
        (c) => ({
          leadIdentifier: c.leadIdentifier,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.cinc.updateLead(this.leadId, this.fieldsToUpdate);
    $.export("$summary", `Successfully updated lead with ID: ${this.leadId}`);
    return response;
  },
};
