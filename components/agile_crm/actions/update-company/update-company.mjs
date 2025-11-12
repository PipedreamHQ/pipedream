import agileCrm from "../../agile_crm.app.mjs";

export default {
  key: "agile_crm-update-company",
  name: "Update Company",
  description: "Updates an existing company in Agile CRM. [See the documentation](https://github.com/agilecrm/rest-api#22-updating-a-company)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    agileCrm,
    company: {
      propDefinition: [
        agileCrm,
        "company",
      ],
      description: "The company to update",
    },
    name: {
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
      description: "Email address of the company",
      optional: true,
    },
    phone: {
      propDefinition: [
        agileCrm,
        "phone",
      ],
      description: "Phone number of the company",
      optional: true,
    },
    url: {
      propDefinition: [
        agileCrm,
        "companyUrl",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      id: this.company,
      properties: [],
    };
    if (this.name) {
      data.properties.push({
        type: "SYSTEM",
        name: "name",
        value: this.name,
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
    if (this.url) {
      data.properties.push({
        type: "SYSTEM",
        name: "url",
        value: this.url,
      });
    }

    const response = await this.agileCrm.updateContact({
      data,
      $,
    });

    $.export("$summary", `Successfully updated company with ID ${response.id}`);

    return response;
  },
};
