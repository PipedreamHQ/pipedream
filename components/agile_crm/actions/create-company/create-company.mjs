import agileCrm from "../../agile_crm.app.mjs";

export default {
  key: "agile_crm-create-company",
  name: "Create Company",
  description: "Create a new company in Agile CRM. [See the documentation](https://github.com/agilecrm/rest-api#21-creating-a-company)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    agileCrm,
    name: {
      propDefinition: [
        agileCrm,
        "companyName",
      ],
    },
    email: {
      propDefinition: [
        agileCrm,
        "email",
      ],
      description: "Email address of the company",
    },
    phone: {
      propDefinition: [
        agileCrm,
        "phone",
      ],
      description: "Phone number of the company",
    },
    url: {
      propDefinition: [
        agileCrm,
        "companyUrl",
      ],
    },
    tags: {
      propDefinition: [
        agileCrm,
        "tags",
      ],
      optional: true,
    },
    score: {
      propDefinition: [
        agileCrm,
        "score",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    let tags;
    if (this.tags?.length) {
      tags = Array.isArray(this.tags)
        ? this.tags
        : JSON.parse(this.tags);
    }

    const data = {
      type: "COMPANY",
      tags,
      lead_score: this.score,
      properties: [
        {
          type: "SYSTEM",
          name: "name",
          value: this.name,
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
        {
          type: "SYSTEM",
          name: "url",
          value: this.url || "",
        },
      ],
    };

    const response = await this.agileCrm.createContact({
      data,
      $,
    });

    $.export("$summary", `Successfully created company with ID ${response.id}`);

    return response;
  },
};
