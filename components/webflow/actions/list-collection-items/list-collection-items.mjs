import app from "../../webflow.app.mjs";

export default {
  key: "webflow-list-collection-items",
  name: "List Collection Items",
  description: "List Items of a collection. [See the documentation](https://developers.webflow.com/data/reference/cms/collection-items/bulk-items/list-items)",
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
  },
  async run({ $ }) {
    const response = await this.app.listCollectionItems(0, this.collectionId);

    $.export("$summary", "Successfully retrieved collection's items");

    return response;
  },
};
