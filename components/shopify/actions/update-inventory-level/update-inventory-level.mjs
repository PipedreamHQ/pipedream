import shopify from "../../shopify.app.mjs";
import { toSingleLineString } from "../common/common.mjs";

export default {
  key: "shopify-update-inventory-level",
  name: "Update Inventory Level",
  description: "Sets the inventory level for an inventory item at a location. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/inventorylevel#[post]/admin/api/2022-01/inventory_levels/set.json)",
  version: "0.0.3",
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
