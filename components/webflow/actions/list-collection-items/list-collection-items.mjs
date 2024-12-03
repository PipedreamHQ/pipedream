import app from "../../webflow.app.mjs";

export default {
  key: "webflow-list-collection-items",
  name: "List Collection Items",
  description: "List Items of a collection. [See the docs here](https://developers.webflow.com/#get-all-items-for-a-collection)",
  version: "1.0.0",
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
