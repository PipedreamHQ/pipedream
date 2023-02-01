import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-update-customer",
  name: "Update Customer",
  description: "Update a existing customer. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[put]/admin/api/2022-01/customers/{customer_id}.json)",
  version: "0.0.4",
  type: "action",
  props: {
    shopify,
    customerId: {
      propDefinition: [
        shopify,
        "customerId",
      ],
    },
    firstName: {
      propDefinition: [
        shopify,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        shopify,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        shopify,
        "email",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        shopify,
        "phone",
      ],
    },
    address: {
      propDefinition: [
        shopify,
        "address",
      ],
    },
    company: {
      propDefinition: [
        shopify,
        "company",
      ],
    },
    city: {
      propDefinition: [
        shopify,
        "city",
      ],
    },
    province: {
      propDefinition: [
        shopify,
        "province",
      ],
    },
    country: {
      propDefinition: [
        shopify,
        "country",
      ],
    },
    zip: {
      propDefinition: [
        shopify,
        "zip",
      ],
    },
  },
  async run({ $ }) {
    let customer = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone,
      addresses: [
        {
          address1: this.address,
          company: this.company,
          city: this.city,
          province: this.province,
          country: this.country,
          zip: this.zip,
        },
      ],
    };
    let response = (await this.shopify.updateCustomer(this.customerId, customer)).result;
    $.export("$summary", `Updated customer \`${response.email}\` with id \`${response.id}\``);
    return response;
  },
};
