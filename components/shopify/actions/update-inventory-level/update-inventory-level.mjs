import shopify from "../../shopify.app.js";

export default {
  key: "shopify-update-inventory-level",
  name: "Update Inventory Level",
  description: "Sets the inventory level for an inventory item at a location",
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    locationId: {
      propDefinition: [
        shopify,
        "locationId",
      ],
    },
    inventoryItemId: {
      type: "string",
      label: "Inventory Item ID",
      description: `The ID of the inventory item associated with the inventory level
        There is a 1:1 relationship between a product variant and an inventory item
        Each product variant includes the ID of its related inventory item
        To find the ID of the inventory item, use the [Inventory Item resource](https://shopify.dev/api/admin-rest/latest/resources/inventoryitem)`,
    },
    available: {
      type: "integer",
      label: "Available",
      description: "Sets the available inventory quantity",
    },
    disconnectIfNecessary: {
      type: "boolean",
      label: "Disconnect If Necessary",
      description: `Whether inventory for any previously connected locations will be set to 0 and the locations disconnected
        This property is ignored when no fulfillment service is involved
        For more information, refer to [Inventory levels and fulfillment service locations](https://shopify.dev/api/admin-rest/2022-01/resources/inventorylevel#inventory-levels-and-fulfillment-service-locations)`,
      optional: true,
    },
  },
  async run({ $ }) {
    let data = {
      location_id: this.locationId,
      inventory_item_id: this.inventoryItemId,
      available: this.available,
      disconnect_if_necessary: this.disconnectIfNecessary,
    };

    let response = await this.shopify.updateInventoryLevel(data);
    $.export("$summary", `Updated inventory level for \`${response.inventory_item_id}\` at \`${response.location_id}\` to \`${response.available}\``);
    return response;
  },
};
