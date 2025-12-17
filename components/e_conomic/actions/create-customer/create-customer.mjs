import economic from "../../e_conomic.app.mjs";

export default {
  key: "e_conomic-create-customer",
  name: "Create Customer",
  description: "Creates a new customer. [See the documentation](https://restdocs.e-conomic.com/#post-customers)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    economic,
    name: {
      propDefinition: [
        economic,
        "name",
      ],
    },
    currency: {
      propDefinition: [
        economic,
        "currencyCode",
      ],
    },
    customerGroupNumber: {
      propDefinition: [
        economic,
        "customerGroupNumber",
      ],
    },
    paymentTermNumber: {
      propDefinition: [
        economic,
        "paymentTermNumber",
      ],
    },
    vatZoneNumber: {
      propDefinition: [
        economic,
        "vatZoneNumber",
      ],
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
    const response = await this.economic.createCustomer({
      $,
      data: {
        name: this.name,
        currency: this.currency,
        customerGroup: {
          customerGroupNumber: this.customerGroupNumber,
        },
        paymentTerms: {
          paymentTermsNumber: this.paymentTermNumber,
        },
        vatZone: {
          vatZoneNumber: this.vatZoneNumber,
        },
        email: this.email,
        mobilePhone: this.mobilePhone,
        website: this.website,
        ean: this.ean,
        address: this.address,
        city: this.city,
        zip: this.zip,
        country: this.country,
      },
    });
    $.export("$summary", "Successfully created customer.");
    return response;
  },
};
