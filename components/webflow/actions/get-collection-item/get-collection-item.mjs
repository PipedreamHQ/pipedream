import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-get-collection-item",
  name: "Get Collection Item",
  description: "Get a Collection Item. [See the docs here](https://developers.webflow.com/#get-single-item)",
  version: "0.1.4",
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

    const response = await webflow.item({
      collectionId: this.collectionId,
      itemId: this.itemId,
    });

    $.export("$summary", "Successfully retrieved collection item");

    return response;
  },
};
