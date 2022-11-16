import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-customer",
  name: "Create Customer",
  description: "Create a new customer. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[post]/admin/api/2022-01/customers.json)",
  version: "0.0.2",
  type: "action",
  props: {
    shopify,
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
    sendEmailInvite: {
      type: "boolean",
      label: "Send Email Invite",
      description: "Send email invite to address",
      optional: true,
    },
  },
  async run({ $ }) {
    let data = {
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
      send_email_invite: this.sendEmailInvite,
    };

    let response = (await this.shopify.createCustomer(data)).result;
    $.export("$summary", `Created new customer \`${this.email}\` with id \`${response.id}\``);
    return response;
  },
};
