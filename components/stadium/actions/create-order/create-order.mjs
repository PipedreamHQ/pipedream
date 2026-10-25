import { ConfigurationError } from "@pipedream/platform";
import stadium from "../../stadium.app.mjs";

export default {
  key: "stadium-create-order",
  name: "Create Order",
  description: "Place a new order against a Stadium Shop. [See the documentation](https://api.bystadium.com/api/v2/docs#tag/Order-management/operation/createOrder)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    stadium,
    storeNumber: {
      propDefinition: [
        stadium,
        "storeNumber",
      ],
    },
    countryIso: {
      type: "string",
      label: "Country ISO",
      description: "ISO code of the country (e.g., `US`)",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Recipient's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Recipient's last name",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Recipient's phone number",
      optional: true,
    },
    street1: {
      type: "string",
      label: "Address Line 1",
      description: "First line of the shipping address",
    },
    street2: {
      type: "string",
      label: "Address Line 2",
      description: "Second line of the shipping address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City",
    },
    stateName: {
      type: "string",
      label: "State",
      description: "State name",
    },
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "Zip code",
    },
    products: {
      type: "string",
      label: "Products",
      description: "JSON array of products to order. Each product should have `id` (variant ID, e.g., `10/1/9`), `quantity`, and `product_type` (e.g., `Spree::Product`). Example: `[{\"id\":\"10/1/9\",\"quantity\":1,\"product_type\":\"Spree::Product\"}]`",
    },
  },
  async run({ $ }) {
    let products;
    if (typeof this.products === "string") {
      try {
        products = JSON.parse(this.products);
      } catch (error) {
        throw new ConfigurationError(
          `Products must be valid JSON array. Each item needs \`id\` (variant ID, e.g., \`10/1/9\`), \`quantity\`, and \`product_type\` (e.g., \`Spree::Product\`). Example: [{"id":"10/1/9","quantity":1,"product_type":"Spree::Product"}]. Parse error: ${error.message}`,
        );
      }
    } else {
      products = this.products;
    }

    const response = await this.stadium.createOrder({
      $,
      data: {
        store_number: this.storeNumber,
        country_iso: this.countryIso,
        address: {
          first_name: this.firstName,
          last_name: this.lastName,
          phone: this.phone,
          zip_code: this.zipCode,
          street_1: this.street1,
          street_2: this.street2,
          city: this.city,
          state_name: this.stateName,
        },
        products,
      },
    });
    $.export("$summary", `Successfully created order ${response.number}`);
    return response;
  },
};
