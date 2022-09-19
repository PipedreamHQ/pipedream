import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-update-item-inventory",
  name: "Update Item Inventory",
  description: "Update the inventory of a specific item. [See the docs here](https://developers.webflow.com/#update-item-inventory)",
  version: "0.0.2",
  type: "action",
  props: {
    webflow,
    siteId: {
      propDefinition: [
        webflow,
        "sites",
      ],
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
    const apiClient = this.webflow._createApiClient();

    const {
      inventoryType,
      quantity,
      updateQuantity,
    } = this;

    const response = await apiClient.patch(`/collections/${this.collectionId}/items/${this.itemId}/inventory`, {
      data: {
        fields: {
          inventoryType,
          quantity,
          updateQuantity,
        },
      },
    });

    $.export("$summary", "Successfully updated item inventory");

    return response;
  },
};
