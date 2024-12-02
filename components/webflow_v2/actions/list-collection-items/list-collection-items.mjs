import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-list-collection-items",
  name: "List Collection Items",
  description: "List Items of a collection. [See the docs here](https://developers.webflow.com/#get-all-items-for-a-collection)",
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
  },
  async run({ $ }) {
    const response = await this.app.listCollectionItems(0, this.collectionId);

    $.export("$summary", "Successfully retrieved collection's items");

    return response;
  },
};
