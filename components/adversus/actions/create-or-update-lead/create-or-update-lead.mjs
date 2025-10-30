import adversus from "../../adversus.app.mjs";

export default {
  key: "adversus-create-or-update-lead",
  name: "Create or Update Lead",
  description: "Create a new lead or update an existing lead in Adversus. [See the API documentation](https://solutions.adversus.io/api).",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    adversus,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the lead",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the lead",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the lead",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the lead",
      optional: true,
    },
    leadId: {
      propDefinition: [
        adversus,
        "leadId",
      ],
      description: "The ID of the lead to update (leave empty to create a new lead)",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional fields to include in the lead data",
      optional: true,
    },
  },
  /**
   * Execute the action to create or update a lead
   * @param {Object} $ - Pipedream context
   * @returns {Promise} The created or updated lead response
   */
  async run({ $ }) {
    const data = {
      ...(this.firstName && { firstName: this.firstName }),
      ...(this.lastName && { lastName: this.lastName }),
      ...(this.email && { email: this.email }),
      ...(this.phone && { phone: this.phone }),
      ...(this.additionalFields || {}),
    };

    const response = this.leadId
      ? await this.adversus.updateLead(this.leadId, { data })
      : await this.adversus.createLead({ data });

    $.export("$summary", this.leadId 
      ? `Successfully updated lead ${this.leadId}` 
      : "Successfully created new lead");

    return response;
  },
};

