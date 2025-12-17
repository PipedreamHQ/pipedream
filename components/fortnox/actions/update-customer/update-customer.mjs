import fortnox from "../../fortnox.app.mjs";

export default {
  key: "fortnox-update-customer",
  name: "Update Customer",
  description: "Updates an existing customer in the Fortnox API. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_Customers/operation/update_14).",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    fortnox,
    customerNumber: {
      propDefinition: [
        fortnox,
        "customerNumber",
      ],
    },
    name: {
      propDefinition: [
        fortnox,
        "customerName",
      ],
      optional: true,
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
    const { Customer: customer } = await this.fortnox.getCustomer({
      $,
      customerNumber: this.customerNumber,
    });

    const response = await this.fortnox.updateCustomer({
      $,
      customerNumber: this.customerNumber,
      data: {
        Customer: {
          Name: this.name || customer.Name,
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
    $.export("$summary", `Successfully updated customer with ID \`${response.Customer.CustomerNumber}\``);
    return response;
  },
};
