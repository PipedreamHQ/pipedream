import { ConfigurationError } from "@pipedream/platform";
import dpd2 from "../../dpd2.app.mjs";

export default {
  key: "dpd2-find-product",
  name: "Find Product",
  description: "Find a product by its SKU or its name. [See the documentation](https://docs.getdpd.com/api/reference/operations/listproducts/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dpd2,
    storefrontId: {
      propDefinition: [
        dpd2,
        "storefrontId",
      ],
      description: "The ID of the store to search, e.g. `14056`. Leave empty to search all your stores. Use **List Storefront ID Options** to find store IDs.",
    },
    sku: {
      type: "string",
      label: "SKU",
      description: "The product's SKU, matched exactly, e.g. `PTS-COOKBOOK`",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The product's name, matched ignoring case, e.g. `Pass The Steak Cookbook`. Used when **SKU** is empty.",
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
