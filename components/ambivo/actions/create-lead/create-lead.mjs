import ambivo from "../../ambivo.app.mjs";

export default {
  key: "ambivo-create-lead",
  name: "Create or Update Lead",
  description: "Produces a new lead for your business. If the lead doesn't exist, it returns updated lead. [See the documentation](https://fapi.ambivo.com/docs#/CRM%20Service%20Calls/post_leads_crm_leads_post)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ambivo,
    firstName: {
      propDefinition: [
        ambivo,
        "firstName",
      ],
      description: "First name of the lead",
    },
    lastName: {
      propDefinition: [
        ambivo,
        "lastName",
      ],
      description: "Last name of the lead",
    },
    phone: {
      propDefinition: [
        ambivo,
        "phone",
      ],
      description: "Phone number of the lead",
    },
    email: {
      propDefinition: [
        ambivo,
        "email",
      ],
      description: "Email address of the lead",
    },
  },
  async run({ $ }) {
    const response = await this.ambivo.createOrUpdateLead({
      $,
      data: {
        name: `${this.firstName} ${this.lastName}`,
        phone_list: this.phone,
        email_list: this.email,
        lead_status: "open",
      },
    });
    $.export("$summary", `Successfully created or updated lead with ID: ${response.id}`);
    return response;
  },
};
