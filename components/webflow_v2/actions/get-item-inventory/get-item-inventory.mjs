import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-get-item-inventory",
  name: "Get Item Inventory",
  description: "Get the inventory of a specific item. [See the docs here](https://developers.webflow.com/#item-inventory)",
  version: "0.0.1",
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
