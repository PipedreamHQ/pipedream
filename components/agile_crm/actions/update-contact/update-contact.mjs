import agileCrm from "../../agile_crm.app.mjs";

export default {
  key: "agile_crm-cupdate-contact",
  name: "Update Contact",
  description: "Update an existing contact in Agile CRM. [See the docs here](https://github.com/agilecrm/rest-api#14-update-properties-of-a-contact-by-id-partial-update)",
  //version: "0.0.1",
  version: "0.0.3",
  type: "action",
  props: {
    agileCrm,
    contact: {
      propDefinition: [
        agileCrm,
        "contact",
      ],
    },
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
      id: this.contact,
      properties: [],
    };
    if (this.firstName) {
      data.properties.push({
        type: "SYSTEM",
        name: "first_name",
        value: this.firstName,
      });
    }
    if (this.lastName) {
      data.properties.push({
        type: "SYSTEM",
        name: "last_name",
        value: this.lastName,
      });
    }
    if (this.company) {
      data.properties.push({
        type: "SYSTEM",
        name: "company",
        value: this.company,
      });
    }
    if (this.email) {
      data.properties.push({
        type: "SYSTEM",
        name: "email",
        value: this.email,
      });
    }
    if (this.phone) {
      data.properties.push({
        name: "phone",
        value: this.phone,
      });
    }

    const response = await this.agileCrm.updateContact({
      data,
      $,
    });

    $.export("$summary", `Successfully updated contact with ID ${response.id}`);

    return response;
  },
};
