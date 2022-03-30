import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-update-item-inventory",
  name: "Update Item Inventory",
  description: "Update the inventory of a specify item",
  version: "0.1.1648564084",
  type: "action",
  props: {
    webflow,
    siteId: {
      propDefinition: [
        webflow,
        "sites",
      ],
      optional: true,
    },
    collectionId: {
      propDefinition: [
        webflow,
        "collections",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    itemId: {
      propDefinition: [
        webflow,
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
      description: "The quantity will be seted with this value. This just can be used with `finite` option selected and without `updateQuantity` value.",
      type: "integer",
      optional: true,
    },
    updateQuantity: {
      label: "Update Quantity",
      description: "This value will be added to the quantity. This just can be used with `finite` option selected and without `quantity` value.",
      type: "integer",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      inventoryType,
      quantity,
      updateQuantity,
    } = this;

    return await this.webflow._makeRequest(`/collections/${this.collectionId}/items/${this.itemId}/inventory`, {
      $,
      config: {
        method: "patch",
        data: {
          fields: {
            inventoryType,
            quantity,
            updateQuantity,
          },
        },
      },
    });
  },
};
