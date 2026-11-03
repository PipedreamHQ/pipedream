import { ConfigurationError } from "@pipedream/platform";
import dpd2 from "../../dpd2.app.mjs";

export default {
  key: "dpd2-find-product",
  name: "Find Product",
  description: "Find a product by its SKU or its name. [See the documentation](https://docs.getdpd.com/api/reference/operations/listproducts/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    dpd2,
    storefrontId: {
      propDefinition: [
        dpd2,
        "storefrontId",
      ],
      description: "Only products in this store. Leave empty to search all your stores.",
    },
    sku: {
      type: "string",
      label: "SKU",
      description: "The product's SKU, matched exactly",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The product's name, matched ignoring case. Used when **SKU** is empty.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.sku && !this.name) {
      throw new ConfigurationError("Enter a **SKU** or a **Name**.");
    }
    // The API can't search products, so this reads the list
    const products = await this.dpd2.listProducts({
      $,
      params: {
        storefront_id: this.storefrontId,
      },
    }) || [];
    const name = String(this.name || "").trim()
      .toLowerCase();
    const matches = products.filter((product) => this.sku
      ? product.sku === this.sku
      : String(product.name || "").trim()
        .toLowerCase() === name);
    $.export("$summary", `Found ${matches.length} product${matches.length === 1
      ? ""
      : "s"}`);
    return matches;
  },
};
