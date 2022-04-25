import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-list-collection-items",
  name: "List Collection Items",
  description: "List Items of a collection. [See the docs here](https://developers.webflow.com/#get-all-items-for-a-collection)",
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
    const response = await this.webflow.getItems(0, this.collectionId);

    $.export("$summary", "Successfully retrieved collections items");

    return response;
  },
};
