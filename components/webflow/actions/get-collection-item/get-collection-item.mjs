import app from "../../webflow.app.mjs";

export default {
  key: "webflow-get-collection-item",
  name: "Get Collection Item",
  description: "Get a Collection Item. [See the documentation](https://developers.webflow.com/data/reference/cms/collection-items/staged-items/get-item)",
  version: "2.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.app.getCollectionItem(this.collectionId, this.itemId);

    $.export("$summary", "Successfully retrieved collection item");

    return response;
  },
};
