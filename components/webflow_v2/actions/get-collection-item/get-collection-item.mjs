import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-get-collection-item",
  name: "Get Collection Item",
  description: "Get a Collection Item. [See the docs here](https://developers.webflow.com/#get-single-item)",
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
    const response = await this.app.getCollectionItem(this.collectionId, this.itemId);

    $.export("$summary", "Successfully retrieved collection item");

    return response;
  },
};
