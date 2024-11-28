import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-update-item-inventory",
  name: "Update Item Inventory",
  description: "Update the inventory of a specific item. [See the docs here](https://developers.webflow.com/#update-item-inventory)",
  version: "0.0.5",
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
