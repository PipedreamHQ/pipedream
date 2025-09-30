import app from "../../webflow.app.mjs";

export default {
  key: "webflow-update-item-inventory",
  name: "Update Item Inventory",
  description: "Update the inventory of a specific item. [See the documentation](https://developers.webflow.com/data/reference/ecommerce/inventory/update)",
  version: "2.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "sites",
      ],
    },
    collectionId: {
      propDefinition: [
        app,
        "collections",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    itemId: {
      propDefinition: [
        app,
        "items",
        (c) => ({
          collectionId: c.collectionId,
        }),
      ],
    },
    inventoryType: {
      label: "Inventory Type",
      description: "The type of the inventory.",
      type: "string",
      options: [
        "finite",
        "infinite",
      ],
    },
    quantity: {
      label: "Quantity",
      description: "If specified, sets quantity to this value. Can only be used with the `finite` inventory type, and if `Update Quantity` is not specified.",
      type: "integer",
      optional: true,
    },
    updateQuantity: {
      label: "Update Quantity",
      description: "If specified, adds this value to the current quantity. Can only be used with the `finite` inventory type, and if `Quantity` is not specified.",
      type: "integer",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      // eslint-disable-next-line no-unused-vars
      siteId,
      collectionId,
      itemId,
      ...data
    } = this;

    const response = await app.updateCollectionItemInventory(collectionId, itemId, data);

    $.export("$summary", "Successfully updated item inventory");

    return response;
  },
};
