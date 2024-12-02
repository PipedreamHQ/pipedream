import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-get-collection",
  name: "Get Collection",
  description: "Get a collection. [See the docs here](https://developers.webflow.com/#get-collection-with-full-schema)",
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
    const response = await this.app.getCollection(this.collectionId);

    $.export("$summary", "Successfully retrieved collection");

    return response;
  },
};
