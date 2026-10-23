import cavyro from "../../cavyro.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "cavyro-create-company",
  name: "Create Company",
  description: "Create a new company in Cavyro. The name must be unique in the workspace, so use **List Companies** first to avoid duplicates."
    + " Use **List Custom Fields** for required custom fields. Link contacts to it with **Create Contact**."
    + " [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    cavyro,
    name: {
      type: "string",
      label: "Name",
      description: "The company name, e.g. `Acme d.o.o.`. Must be unique in the workspace.",
    },
    website: {
      type: "string",
      label: "Website",
      description: "The company website, e.g. `https://example.com`.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The company phone number, e.g. `+381111234567`.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city the company is based in, e.g. `Novi Sad`.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country the company is based in, e.g. `RS`.",
      optional: true,
    },
    description: {
      propDefinition: [
        cavyro,
        "description",
      ],
    },
    customFields: {
      propDefinition: [
        cavyro,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    const company = await this.cavyro.createCompany({
      $,
      data: {
        company: {
          name: this.name,
          website: this.website,
          phone: this.phone,
          city: this.city,
          country: this.country,
          description: this.description,
          custom_fields: parseObject(this.customFields),
        },
      },
    });
    $.export("$summary", `Created company ${company.id}: ${company.name}`);
    return company;
  },
};
