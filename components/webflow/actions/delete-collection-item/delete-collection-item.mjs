import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-delete-collection-item",
  name: "Delete Collection Item",
  description: "Delete Item of a Collection",
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
  async run() {
    const webflow = this.webflow._createApiClient();

    return await webflow.removeItem({
      collectionId: this.collectionId,
      itemId: this.itemId,
    });
  },
};
