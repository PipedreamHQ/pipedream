import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-get-collection-item",
  name: "Get Collection Item",
  description: "Get a Collection Item",
  version: "0.2.2",
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
    return await webflow.item({
      collectionId: this.collectionId,
      itemId: this.itemId,
    });
  },
};
