import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-update-collection-item",
  name: "Update Collection Item",
  description: "Update collection item. [See the documentation](https://developers.webflow.com/#update-collection-item)",
  version: "0.1.6",
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
      reloadProps: true,
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
  async additionalProps() {
    const props = {};
    if (!this.collectionId) {
      return props;
    }
    const { fields } = await this.webflow.getCollection(this.collectionId);
    for (const field of fields) {
      if (field.editable && field.slug !== "_archived" && field.slug !== "_draft") {
        props[field.slug] = {
          type: "string",
          label: field.name,
          description: field.slug === "name"
            ? "Name given to the Item."
            : field.slug === "slug"
              ? "URL structure of the Item in your site. Note: Updates to an item slug will break all links referencing the old slug."
              : "See the documentation for additional information about [Field Types & Item Values](https://developers.webflow.com/reference/field-types-item-values).",
          optional: true,
        };
      }
    }

    return props;
  },
  async run({ $ }) {
    const {
      webflow,
      // eslint-disable-next-line no-unused-vars
      siteId,
      collectionId,
      itemId,
      name,
      slug,
      ...customFields
    } = this;

    const webflowClient = webflow._createApiClient();

    const item = await webflowClient.item({
      collectionId,
      itemId,
    });

    const response = await webflowClient.updateItem({
      collectionId,
      itemId,
      name: name || item.name,
      slug: slug || item.slug,
      _archived: false,
      _draft: false,
      ...customFields,
    });

    $.export("$summary", "Successfully updated collection item");

    return response;
  },
};
