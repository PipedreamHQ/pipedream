import klussenbeheer from "../../klussenbeheer.app.mjs";

export default {
  key: "klussenbeheer-create-customer",
  name: "Create Customer",
  description: "Add a new customer. If a customer with the same phone number or email address already exists, it is reused unchanged. [See the documentation](https://samdesk.nl/klussenbeheer/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  ai: "optimized",
  props: {
    klussenbeheer,
    customerName: {
      propDefinition: [
        klussenbeheer,
        "customerName",
      ],
    },
    phone: {
      propDefinition: [
        klussenbeheer,
        "phone",
      ],
    },
    email: {
      propDefinition: [
        klussenbeheer,
        "email",
      ],
    },
    customerAddress: {
      propDefinition: [
        klussenbeheer,
        "customerAddress",
      ],
    },
    houseNumber: {
      propDefinition: [
        klussenbeheer,
        "houseNumber",
      ],
    },
    postalCode: {
      propDefinition: [
        klussenbeheer,
        "postalCode",
      ],
    },
    city: {
      propDefinition: [
        klussenbeheer,
        "city",
      ],
    },
    business: {
      propDefinition: [
        klussenbeheer,
        "business",
      ],
    },
    kvkNumber: {
      propDefinition: [
        klussenbeheer,
        "kvkNumber",
      ],
    },
  },
  async run({ $ }) {
    const customer = await this.klussenbeheer.createCustomer($, {
      customerName: this.customerName,
      phone: this.phone,
      email: this.email,
      customerAddress: this.customerAddress,
      houseNumber: this.houseNumber,
      postalCode: this.postalCode,
      city: this.city,
      business: this.business,
      kvkNumber: this.kvkNumber,
    });

    $.export("$summary", `Customer "${customer.name ?? this.customerName}" created or reused`);

    return customer;
  },
};
