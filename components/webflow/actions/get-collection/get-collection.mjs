import app from "../../webflow.app.mjs";

export default {
  key: "webflow-get-collection",
  name: "Get Collection",
  description: "Get a collection. [See the documentation](https://developers.webflow.com/data/reference/cms/collections/get)",
  version: "2.0.0",
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
    const response = await this.app.getCollection(this.collectionId);

    $.export("$summary", "Successfully retrieved collection");

    return response;
  },
};
