import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-get-item-inventory",
  name: "Get Item Inventory",
  description: "Get the inventory of a specify item",
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
  },
  async run({ $ }) {
    return await this.webflow._makeRequest(`/collections/${this.collectionId}/items/${this.itemId}/inventory`, {
      $,
    });
  },
};
