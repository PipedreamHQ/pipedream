import agileCrm from "../../agile_crm.app.mjs";

export default {
  key: "agile_crm-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Agile CRM. [See the docs here](https://github.com/agilecrm/rest-api#13-creating-a-contact)",
  version: "0.0.1",
  type: "action",
  props: {
    agileCrm,
    firstName: {
      propDefinition: [
        agileCrm,
        "firstName",
      ],
      optional: false,
    },
    lastName: {
      propDefinition: [
        agileCrm,
        "lastName",
      ],
    },
    company: {
      propDefinition: [
        agileCrm,
        "company",
      ],
    },
    email: {
      propDefinition: [
        agileCrm,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        agileCrm,
        "phone",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      properties: [
        {
          type: "SYSTEM",
          name: "first_name",
          value: this.firstName,
        },
        {
          type: "SYSTEM",
          name: "last_name",
          value: this.lastName || "",
        },
        {
          type: "SYSTEM",
          name: "company",
          value: this.company || "",
        },
        {
          type: "SYSTEM",
          name: "email",
          value: this.email || "",
        },
        {
          name: "phone",
          value: this.phone || "",
        },
      ],
    };

    const response = await this.agileCrm.createContact({
      data,
      $,
    });

    $.export("$summary", `Successfully created contact with ID ${response.id}`);

    return response;
  },
};
