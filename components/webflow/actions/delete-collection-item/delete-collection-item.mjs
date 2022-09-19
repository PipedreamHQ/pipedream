import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-delete-collection-item",
  name: "Delete Collection Item",
  description: "Delete Item of a Collection. [See the docs here](https://developers.webflow.com/#remove-collection-item)",
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
  },
  async run({ $ }) {
    const webflow = this.webflow._createApiClient();

    const response = await webflow.removeItem({
      collectionId: this.collectionId,
      itemId: this.itemId,
    });

    $.export("$summary", "Successfully deleted item");

    return response;
  },
};
