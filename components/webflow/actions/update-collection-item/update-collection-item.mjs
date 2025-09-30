import app from "../../webflow.app.mjs";

export default {
  key: "webflow-update-collection-item",
  name: "Update Collection Item",
  description:
    "Update collection item. [See the documentation](https://developers.webflow.com/data/reference/cms/collection-items/bulk-items/update-items)",
  version: "2.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.collectionId) {
      return props;
    }
    const { fields } = await this.app.getCollection(this.collectionId);
    for (const field of fields) {
      if (
        field.isEditable &&
        field.slug !== "isArchived" &&
        field.slug !== "isDraft"
      ) {
        props[field.slug] = {
          type: "string",
          label: field.name,
          description:
            field.slug === "name"
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
      app,
      // eslint-disable-next-line no-unused-vars
      siteId,
      collectionId,
      itemId,
      name,
      slug,
      ...customFields
    } = this;

    const item = await app.getCollectionItem(collectionId, itemId);

    const response = await app.updateCollectionItem(collectionId, itemId, {
      id: itemId,
      isArchived: false,
      isDraft: false,
      fieldData: {
        ...customFields,
        name: name || item.fieldData.name,
        slug: slug || item.fieldData.slug,
      },
    });

    $.export("$summary", "Successfully updated collection item");

    return response;
  },
};
