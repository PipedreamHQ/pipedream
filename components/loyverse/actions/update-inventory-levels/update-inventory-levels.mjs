import { parseAsJSON } from "../../common/utils.mjs";
import loyverse from "../../loyverse.app.mjs";

export default {
  key: "loyverse-update-inventory-levels",
  name: "Update Inventory Levels",
  description: "Batch updates the inventory levels for specific item variants. [See the documentation](https://developer.loyverse.com/docs/#tag/Inventory/paths/~1inventory/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    loyverse,
    inventoryLevels: {
      type: "string[]",
      label: "Inventory Levels",
      description: "[An array of JSON-stringified objects](https://developer.loyverse.com/docs/#tag/Inventory/paths/~1inventory/post). You can use the props below to generate each item and copy it into this array.",
    },
    storeId: {
      propDefinition: [
        loyverse,
        "storeId",
      ],
      reloadProps: true,
    },
    itemVariantId: {
      propDefinition: [
        loyverse,
        "itemVariantId",
      ],
      reloadProps: true,
    },
    inStock: {
      type: "integer",
      label: "In Stock",
      description: "The current stock at the specified store",
      reloadProps: true,
    },
    updatedAt: {
      type: "string",
      label: "Updated At",
      description: "The date/time when the specified stock was calculated",
      reloadProps: true,
    },
  },
  additionalProps() {
    const {
      storeId, itemVariantId, inStock, updatedAt,
    } = this;
    if ([
      storeId,
      itemVariantId,
      inStock,
      updatedAt,
    ].includes(undefined)) {
      return {};
    }
    return {
      output: {
        type: "alert",
        alertType: "info",
        content: `\`{ "variant_id": "${itemVariantId}", "store_id": "${storeId}", "stock_after": ${inStock}, "updated_at": "${updatedAt}" }\``,
      },
    };
  },
  async run({ $ }) {
    const response = await this.loyverse.batchUpdateInventoryLevels({
      $,
      data: {
        inventory_levels: this.inventoryLevels.map(parseAsJSON),
      },
    });
    $.export("$summary", "Successfully updated inventory levels");
    return response;
  },
};
