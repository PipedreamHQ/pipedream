import rex from "../../rex.app.mjs";

export default {
  key: "rex-create-lead",
  name: "Create Lead",
  description: "Creates a new lead in Rex. [See the documentation](https://api-docs.rexsoftware.com/service/leads#operation/create)",
  version: "0.0.1",
  type: "action",
  props: {
    rex,
    leadType: {
      type: "string",
      label: "Lead Type",
      description: "The type of lead",
      options: [
        {
          value: "general",
          label: "General",
        },
        {
          value: "appraisal_request",
          label: "Appraisal Request",
        },
        {
          value: "listing_enquiry",
          label: "Listing Enquiry",
        },
      ],
    },
    contactId: {
      propDefinition: [
        rex,
        "contactId",
      ],
    },
    sourceId: {
      propDefinition: [
        rex,
        "sourceId",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "Message filled in by the user about the reason for contact",
    },
    projectId: {
      propDefinition: [
        rex,
        "projectId",
      ],
    },
  },
  async run() {

  },
};
