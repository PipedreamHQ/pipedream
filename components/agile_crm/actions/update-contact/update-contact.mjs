import agileCrm from "../../agile_crm.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "agile_crm-update-contact",
  name: "Update Contact",
  description: "Update an existing contact in Agile CRM. [See the documentation](https://github.com/agilecrm/rest-api#14-update-properties-of-a-contact-by-id-partial-update)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        "companyName",
      ],
      optional: true,
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
    customFields: {
      propDefinition: [
        agileCrm,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      id: this.contact,
      properties: utils.getCustomFieldsProperties(this.customFields),
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
