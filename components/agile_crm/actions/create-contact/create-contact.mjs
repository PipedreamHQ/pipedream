import agileCrm from "../../agile_crm.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "agile_crm-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Agile CRM. [See the docs here](https://github.com/agilecrm/rest-api#13-creating-a-contact)",
  version: "0.0.2",
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
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Please provide a JSON structure like this per row: `{\"name\": \"Field Name\", \"value\": \"Field Value\"}`",
      optional: true,
    },
  },
  methods: {
    getAdditionalProperties(customFields) {
      if (!customFields) {
        return [];
      }

      if (!Array.isArray(customFields)) {
        throw new ConfigurationError("Custom Fields property is not an array");
      }

      try {
        return customFields.map(JSON.parse)
          .map(({
            name, value = "",
          }, idx) => {
            if (!name) {
              throw `No "name" property specified in row ${idx + 1}`;
            }
            return {
              type: "CUSTOM",
              name,
              value,
            };
          });
      } catch (error) {
        throw new ConfigurationError(`Custom Field row not set with the right JSON structure: ${error}`);
      }
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
    } = this;

    const data = {
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
        ...this.getAdditionalProperties(customFields),
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
