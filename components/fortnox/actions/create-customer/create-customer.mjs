import fortnox from "../../fortnox.app.mjs";

export default {
  key: "fortnox-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in the Fortnox API. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_Customers/operation/create_16).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    fortnox,
    name: {
      propDefinition: [
        fortnox,
        "customerName",
      ],
    },
    email: {
      propDefinition: [
        fortnox,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        fortnox,
        "phone",
      ],
    },
    address1: {
      propDefinition: [
        fortnox,
        "address1",
      ],
    },
    address2: {
      propDefinition: [
        fortnox,
        "address2",
      ],
    },
    city: {
      propDefinition: [
        fortnox,
        "city",
      ],
    },
    zipCode: {
      propDefinition: [
        fortnox,
        "zipCode",
      ],
    },
    country: {
      propDefinition: [
        fortnox,
        "country",
      ],
    },
    type: {
      propDefinition: [
        fortnox,
        "customerType",
      ],
    },
    vat: {
      propDefinition: [
        fortnox,
        "customerVat",
      ],
    },
    vatType: {
      propDefinition: [
        fortnox,
        "vatType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fortnox.createCustomer({
      $,
      data: {
        Customer: {
          Name: this.name,
          Email: this.email,
          Phone1: this.phone,
          Address1: this.address1,
          Address2: this.address2,
          City: this.city,
          ZipCode: this.zipCode,
          Country: this.country,
          Type: this.type,
          VAT: this.vat,
          VATType: this.vatType,
        },
      },
    });
    $.export("$summary", `Successfully created customer with ID \`${response.Customer.CustomerNumber}\``);
    return response;
  },
};
