import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-get-collection",
  name: "Get Collection",
  description: "Get a collection",
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
  async run() {
    return await this.webflow.getCollection(this.collectionId);
  },
};
