import companyhub from "../../companyhub.app.mjs";

export default {
  key: "companyhub-create-company",
  name: "Create Company",
  description: "Creates a new company. [See the documentation](https://companyhub.com/docs/api-documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    companyhub,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the company",
    },
    website: {
      type: "string",
      label: "Website",
      description: "The website URL of the company",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the company",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the company",
      optional: true,
    },
    billingStreet: {
      type: "string",
      label: "Billing Street",
      description: "The billing street address",
      optional: true,
    },
    billingCity: {
      type: "string",
      label: "Billing City",
      description: "The billing city",
      optional: true,
    },
    billingState: {
      type: "string",
      label: "Billing State",
      description: "The billing state/province",
      optional: true,
    },
    billingCountry: {
      type: "string",
      label: "Billing Country",
      description: "The billing country",
      optional: true,
    },
    billingPostalCode: {
      type: "string",
      label: "Billing Postal Code",
      description: "The billing postal/zip code",
      optional: true,
    },
    shippingStreet: {
      type: "string",
      label: "Shipping Street",
      description: "The shipping street address",
      optional: true,
    },
    shippingCity: {
      type: "string",
      label: "Shipping City",
      description: "The shipping city",
      optional: true,
    },
    shippingState: {
      type: "string",
      label: "Shipping State",
      description: "The shipping state/province",
      optional: true,
    },
    shippingCountry: {
      type: "string",
      label: "Shipping Country",
      description: "The shipping country",
      optional: true,
    },
    shippingPostalCode: {
      type: "string",
      label: "Shipping Postal Code",
      description: "The shipping postal/zip code",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.companyhub.createCompany({
      $,
      data: {
        Name: this.name,
        Website: this.website,
        Phone: this.phone,
        Description: this.description,
        BillingStreet: this.billingStreet,
        BillingCity: this.billingCity,
        BillingState: this.billingState,
        BillingCountry: this.billingCountry,
        BillingPostalCode: this.billingPostalCode,
        ShippingStreet: this.shippingStreet,
        ShippingCity: this.shippingCity,
        ShippingState: this.shippingState,
        ShippingCountry: this.shippingCountry,
        ShippingPostalCode: this.shippingPostalCode,
      },
    });
    if (response.Success) {
      $.export("$summary", `Successfully created company with ID: ${response.Id}`);
    }
    return response;
  },
};
