import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-get-item-inventory",
  name: "Get Item Inventory",
  description: "Get the inventory of a specific item. [See the docs here](https://developers.webflow.com/#item-inventory)",
  version: "0.0.3",
  type: "action",
  props: {
    webflow,
    siteId: {
      propDefinition: [
        webflow,
        "sites",
      ],
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
    itemId: {
      propDefinition: [
        webflow,
        "items",
        (c) => ({
          collectionId: c.collectionId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const apiClient = this.webflow._createApiClient();

    const response = await apiClient.apiClient.get(`/collections/${this.collectionId}/items/${this.itemId}/inventory`);

    $.export("$summary", "Successfully retrieved item inventory");

    return response;
  },
};
