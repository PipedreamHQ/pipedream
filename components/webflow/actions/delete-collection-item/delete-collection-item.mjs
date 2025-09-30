import app from "../../webflow.app.mjs";

export default {
  key: "webflow-delete-collection-item",
  name: "Delete Collection Item",
  description: "Delete Item of a Collection. [See the documentation](https://developers.webflow.com/data/reference/cms/collection-items/staged-items/delete-item)",
  version: "2.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const {
      collectionId, itemId,
    } = this;
    const response = await this.app.deleteCollectionItem(collectionId, itemId);

    $.export("$summary", "Successfully deleted item");

    return response;
  },
};
