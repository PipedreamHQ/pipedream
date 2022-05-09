import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-get-collection",
  name: "Get Collection",
  description: "Get a collection. [See the docs here](https://developers.webflow.com/#get-collection-with-full-schema)",
  version: "0.0.1",
  type: "action",
  props: {
    webflow,
    siteId: {
      propDefinition: [
        webflow,
        "sites",
      ],
      optional: true,
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
  },
  async run({ $ }) {
    const response = await this.webflow.getCollection(this.collectionId);

    $.export("$summary", "Successfully retrieved collection");

    return response;
  },
};
