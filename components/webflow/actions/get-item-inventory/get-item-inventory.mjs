import app from "../../webflow.app.mjs";

export default {
  key: "webflow-get-item-inventory",
  name: "Get Item Inventory",
  description: "Get the inventory of a specific item. [See the documentation](https://developers.webflow.com/data/reference/ecommerce/inventory/list)",
  version: "2.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const response = await this.app.getCollectionItemInventory(this.collectionId, this.itemId);

    $.export("$summary", "Successfully retrieved item inventory");

    return response;
  },
};
