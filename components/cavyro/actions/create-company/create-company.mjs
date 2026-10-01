import cavyro from "../../cavyro.app.mjs";

export default {
  key: "cavyro-create-company",
  name: "Create Company",
  description: "Create a new company in Cavyro. [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "action",
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
      description: "The company name. Must be unique in the workspace.",
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
      description: "The company phone number.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city the company is based in.",
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
          custom_fields: this.customFields,
        },
      },
    });
    $.export("$summary", `Created company ${company.id}: ${company.name}`);
    return company;
  },
};
