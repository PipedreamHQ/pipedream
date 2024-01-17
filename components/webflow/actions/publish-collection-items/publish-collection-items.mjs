import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-publish-collection-items",
  name: "Publish Collection Items",
  description: "Publish one or more items. [See the documentation](https://docs.developers.webflow.com/reference/publish-item)",
  version: "0.0.1",
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
      label: "Item ID(s)",
      type: "string[]",
      description: "The item(s) to publish",
    },
    live: {
      type: "boolean",
      label: "Live",
      description: "Whether to update the live version",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      collectionId, itemIds, live,
    } = this;

    const client = this.webflow._createApiClient();
    const response = await client.publishItems({
      collectionId,
      itemIds,
      live,
    });

    $.export("$summary", `Successfully published ${itemIds.length} item${itemIds.length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
