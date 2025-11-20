import economic from "../../e_conomic.app.mjs";

export default {
  key: "e_conomic-update-customer",
  name: "Update Customer",
  description: "Updates an existing customer. [See the documentation](https://restdocs.e-conomic.com/#put-customers-customernumber)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    economic,
    customerNumber: {
      propDefinition: [
        economic,
        "customerNumber",
      ],
    },
    name: {
      propDefinition: [
        economic,
        "name",
      ],
      optional: true,
    },
    currency: {
      propDefinition: [
        economic,
        "currencyCode",
      ],
      optional: true,
    },
    customerGroupNumber: {
      propDefinition: [
        economic,
        "customerGroupNumber",
      ],
      optional: true,
    },
    paymentTermNumber: {
      propDefinition: [
        economic,
        "paymentTermNumber",
      ],
      optional: true,
    },
    vatZoneNumber: {
      propDefinition: [
        economic,
        "vatZoneNumber",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        economic,
        "email",
      ],
    },
    mobilePhone: {
      propDefinition: [
        economic,
        "mobilePhone",
      ],
    },
    website: {
      propDefinition: [
        economic,
        "website",
      ],
    },
    ean: {
      propDefinition: [
        economic,
        "ean",
      ],
    },
    address: {
      propDefinition: [
        economic,
        "streetAddress",
      ],
    },
    city: {
      propDefinition: [
        economic,
        "city",
      ],
    },
    zip: {
      propDefinition: [
        economic,
        "zip",
      ],
    },
    country: {
      propDefinition: [
        economic,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const customer = await this.economic.getCustomer({
      $,
      customerNumber: this.customerNumber,
    });
    const response = await this.economic.updateCustomer({
      $,
      customerNumber: this.customerNumber,
      data: {
        name: this.name || customer.name,
        currency: this.currency || customer.currency,
        customerGroup: this.customerGroupNumber
          ? {
            customerGroupNumber: this.customerGroupNumber,
          }
          : customer.customerGroup,
        paymentTerms: this.paymentTermNumber
          ? {
            paymentTermsNumber: this.paymentTermNumber,
          }
          : customer.paymentTerms,
        vatZone: this.vatZoneNumber
          ? {
            vatZoneNumber: this.vatZoneNumber,
          }
          : customer.vatZone,
        email: this.email || customer.email,
        mobilePhone: this.mobilePhone || customer.mobilePhone,
        website: this.website || customer.website,
        ean: this.ean || customer.ean,
        address: this.address || customer.address,
        city: this.city || customer.city,
        zip: this.zip || customer.zip,
        country: this.country || customer.country,
      },
    });
    $.export("$summary", `Successfully updated customer with ID ${this.customerNumber}`);
    return response;
  },
};
