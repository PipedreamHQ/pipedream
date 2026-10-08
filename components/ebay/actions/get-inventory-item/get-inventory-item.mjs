import ebay from "../../ebay.app.mjs";

export default {
  key: "ebay-get-inventory-item",
  name: "Get Inventory Item",
  description: "Retrieves the inventory item record for a given SKU (title, description, aspects, condition, availability) from the eBay inventory catalog without modifying any data. [See the documentation](https://developer.ebay.com/api-docs/sell/inventory/resources/inventory_item/methods/getInventoryItem)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ebay,
    sku: {
      propDefinition: [
        ebay,
        "sku",
      ],
    },
  },
  async run({ $ }) {
    const { sku } = this;

    const response = await this.ebay.getInventoryItem({
      $,
      sku,
    });

    $.export("$summary", `Successfully retrieved inventory item for SKU: ${sku}`);

    return response;
  },
};
