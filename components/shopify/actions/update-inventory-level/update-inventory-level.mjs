import shopify from "../../shopify.app.mjs";
import { INVENTORY_ADJUSTMENT_REASONS } from "../../common/constants.mjs";

export default {
  key: "shopify-update-inventory-level",
  name: "Update Inventory Level",
  description: "Sets the inventory level for an inventory item at a location. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/inventorySetOnHandQuantities)",
  version: "0.0.17",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
    locationId: {
      propDefinition: [
        shopify,
        "locationId",
      ],
    },
    productId: {
      propDefinition: [
        shopify,
        "productId",
      ],
    },
    inventoryItemId: {
      propDefinition: [
        shopify,
        "inventoryItemId",
        (c) => ({
          productId: c.productId,
        }),
      ],
    },
    available: {
      type: "integer",
      label: "Available",
      description: "Sets the available inventory quantity",
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "The reason for the quantity changes",
      options: INVENTORY_ADJUSTMENT_REASONS,
    },
    referenceDocumentUri: {
      type: "string",
      label: "Reference Document URI",
      description: "A freeform URI that represents why the inventory change happened. This can be the entity adjusting inventory quantities or the Shopify resource that's associated with the inventory adjustment. For example, a unit in a draft order might have been previously reserved, and a merchant later creates an order from the draft order. In this case, the referenceDocumentUri for the inventory adjustment is a URI referencing the order ID.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.shopify.updateInventoryLevel({
      input: {
        reason: this.reason,
        referenceDocumentUri: this.referenceDocumentUri,
        setQuantities: [
          {
            inventoryItemId: this.inventoryItemId,
            locationId: this.locationId,
            quantity: this.available,
          },
        ],
      },
    });
    if (response.inventorySetOnHandQuantities.userErrors.length > 0) {
      throw new Error(response.inventorySetOnHandQuantities.userErrors[0].message);
    }
    $.export("$summary", `Updated inventory level for \`${this.inventoryItemId}\` at \`${this.locationId}\` to \`${this.available}\``);
    return response;
  },
};
