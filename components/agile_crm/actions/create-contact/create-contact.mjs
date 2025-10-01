import agileCrm from "../../agile_crm.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "agile_crm-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Agile CRM. [See the documentation](https://github.com/agilecrm/rest-api#13-creating-a-contact)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const {
      firstName,
      lastName,
      company,
      email,
      phone,
      customFields,
      score,
    } = this;

    let tags;
    if (this.tags?.length) {
      tags = Array.isArray(this.tags)
        ? this.tags
        : JSON.parse(this.tags);
    }

    const data = {
      tags,
      lead_score: score,
      properties: [
        {
          type: "SYSTEM",
          name: "first_name",
          value: firstName,
        },
        {
          type: "SYSTEM",
          name: "last_name",
          value: lastName || "",
        },
        {
          type: "SYSTEM",
          name: "company",
          value: company || "",
        },
        {
          type: "SYSTEM",
          name: "email",
          value: email || "",
        },
        {
          name: "phone",
          value: phone || "",
        },
        ...utils.getCustomFieldsProperties(customFields),
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
