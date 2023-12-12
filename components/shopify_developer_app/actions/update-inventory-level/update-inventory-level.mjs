import shopify from "../../shopify_developer_app.app.mjs";
import common from "../../../shopify/actions/update-inventory-level/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-update-inventory-level",
  name: "Update Inventory Level",
  description: "Sets the inventory level for an inventory item at a location. [See the documenation](https://shopify.dev/api/admin-rest/2022-01/resources/inventorylevel#[post]/admin/api/2022-01/inventory_levels/set.json)",
  version: "0.0.2",
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
    ...common.props,
  },
};
