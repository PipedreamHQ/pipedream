import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-publish-collection-item",
  name: "Publish Collection Item",
  description: "Publish one or more items. [See the docs here](https://docs.developers.webflow.com/reference/publish-item)",
  version: "0.0.1",
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
