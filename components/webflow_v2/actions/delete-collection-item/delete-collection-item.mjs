import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-delete-collection-item",
  name: "Delete Collection Item",
  description: "Delete Item of a Collection. [See the docs here](https://developers.webflow.com/#remove-collection-item)",
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
    const {
      collectionId, itemId,
    } = this;
    const response = await this.app.deleteCollectionItem(collectionId, itemId);

    $.export("$summary", "Successfully deleted item");

    return response;
  },
};
