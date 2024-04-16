import ambivo from "../../ambivo.app.mjs";

export default {
  key: "ambivo-create-contact",
  name: "Create or Update Contact",
  description: "Generates a new contact in the Ambivo database. If the contact already exists, it updates the contact. [See the documentation](https://fapi.ambivo.com/docs#/CRM%20Service%20Calls/post_contacts_crm_contacts_post)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ambivo,
    firstName: {
      propDefinition: [
        ambivo,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        ambivo,
        "lastName",
      ],
    },
    phone: {
      propDefinition: [
        ambivo,
        "phone",
      ],
    },
    email: {
      propDefinition: [
        ambivo,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ambivo.createOrUpdateContact({
      $,
      data: {
        name: `${this.firstName} ${this.lastName}`,
        phone_list: this.phone,
        email_list: this.email,
        status: "open",
      },
    });
    $.export("$summary", `Successfully created or updated contact with ID ${response.id}`);
    return response;
  },
};
