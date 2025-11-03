import workamajig from "../../workamajig.app.mjs";

export default {
  key: "workamajig-create-company",
  name: "Create a Company",
  description: "Creates a new company in Workamajig. [See the documentation](https://app6.workamajig.com/platinum/?aid=common.apidocs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workamajig,
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Name of the new company",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the new company",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the company's primary contact",
      optional: true,
    },
    address: {
      type: "string",
      label: "Street Address",
      description: "Street address of the company",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the company",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State/region of the company",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal code of the company",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country of the company",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.workamajig.createCompany({
      data: {
        companyName: this.companyName,
        phone: this.phone,
        primaryContactEmail: this.email,
        address1: this.address,
        city: this.city,
        state: this.state,
        postalCode: this.postalCode,
        country: this.country,
      },
      $,
    });
    $.export("$summary", `Successfully created company ${this.companyName}.`);
    return response;
  },
};
