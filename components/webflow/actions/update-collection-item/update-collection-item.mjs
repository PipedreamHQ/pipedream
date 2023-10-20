import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-update-collection-item",
  name: "Update Collection Item",
  description: "Update collection item. [See the docs here](https://developers.webflow.com/#update-collection-item)",
  version: "0.1.5",
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
    name: {
      label: "Name",
      description: "Name given to the Item.",
      type: "string",
    },
    slug: {
      label: "Slug",
      description: "URL structure of the Item in your site. Note: Updates to an item slug will break all links referencing the old slug.",
      type: "string",
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Add any custom fields that exist in your collection.",
      optional: true,
    },
  },
  async run({ $ }) {
    const webflow = this.webflow._createApiClient();

    const response = await webflow.updateItem({
      collectionId: this.collectionId,
      itemId: this.itemId,
      name: this.name,
      slug: this.slug,
      _archived: false,
      _draft: false,
      ...this.customFields,
    });

    $.export("$summary", "Successfully updated collection item");

    return response;
  },
};
