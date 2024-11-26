import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-get-collection-item",
  name: "Get Collection Item",
  description: "Get a Collection Item. [See the docs here](https://developers.webflow.com/#get-single-item)",
  version: "0.0.{{ts}}",
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
    const webflow = this.app._createApiClient();

    const response = await webflow.item({
      collectionId: this.collectionId,
      itemId: this.itemId,
    });

    $.export("$summary", "Successfully retrieved collection item");

    return response;
  },
};
