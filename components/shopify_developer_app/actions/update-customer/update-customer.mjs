import shopify from "../../shopify_developer_app.app.mjs";
import common from "../common/metafield-actions.mjs";

export default {
  ...common,
  key: "shopify_developer_app-update-customer",
  name: "Update Customer",
  description: "Update a existing customer. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/customerupdate)",
  version: "0.0.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    metafields: {
      propDefinition: [
        shopify,
        "metafields",
      ],
    },
  },
  async run({ $ }) {
    const metafields = await this.createMetafieldsArray(this.metafields, this.customerId, "customer");

    const response = await this.shopify.updateCustomer({
      input: {
        id: this.customerId,
        firstName: this.firstName,
        lastName: this.lastName,
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
        metafields,
      },
    });
    if (response.customerUpdate.userErrors.length > 0) {
      throw new Error(response.customerUpdate.userErrors[0].message);
    }
    $.export("$summary", `Updated customer \`${response.customerUpdate.customer.email || response.customerUpdate.customer.firstName}\` with ID \`${response.customerUpdate.customer.id}\``);
    return response;
  },
};
