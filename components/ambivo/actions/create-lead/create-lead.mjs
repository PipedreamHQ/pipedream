import ambivo from "../../ambivo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ambivo-create-lead",
  name: "Create or Update Lead",
  description: "Produces a new lead for your business. If the lead doesn't exist, it returns updated lead.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ambivo,
    leadDetails: {
      propDefinition: [
        ambivo,
        "leadDetails",
      ],
      description: "Details of the lead to be created or updated. Include information such as name, contact details, and lead source.",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional notes about the lead",
      optional: true,
    },
    leadStatus: {
      type: "string",
      label: "Lead Status",
      description: "The status of the lead",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {
      ...this.leadDetails,
      notes: this.notes,
      status: this.leadStatus,
    };
    const response = await this.ambivo.createOrUpdateLead(payload);
    $.export("$summary", `Successfully created or updated lead with ID: ${response.id}`);
    return response;
  },
};
