import { toSingleLineString } from "../common/common.mjs";

export default {
  props: {
    available: {
      type: "integer",
      label: "Available",
      description: "Sets the available inventory quantity",
    },
    disconnectIfNecessary: {
      type: "boolean",
      label: "Disconnect If Necessary",
      description: toSingleLineString(`
        Whether inventory for any previously connected locations will be set to 0 and the locations disconnected.
        This property is ignored when no fulfillment service is involved.
        For more information, refer to [Inventory levels and fulfillment service locations](https://shopify.dev/api/admin-rest/2022-01/resources/inventorylevel#inventory-levels-and-fulfillment-service-locations)
      `),
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

    let response = (await this.shopify.updateInventoryLevel(data)).result;
    $.export("$summary", `Updated inventory level for \`${response.inventory_item_id}\` at \`${response.location_id}\` to \`${response.available}\``);
    return response;
  },
};
