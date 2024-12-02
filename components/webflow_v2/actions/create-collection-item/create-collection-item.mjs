import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-create-collection-item",
  name: "Create Collection Item",
  description: "Create new collection item. [See the docs here](https://developers.webflow.com/#create-new-collection-item)",
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
      if (field.isEditable && field.slug !== "isArchived" && field.slug !== "isDraft") {
        props[field.slug] = {
          type: "string",
          label: field.name,
          description: field.slug === "name"
            ? "Name given to the Item."
            : field.slug === "slug"
              ? "URL structure of the Item in your site."
              : "See the documentation for additional information about [Field Types & Item Values](https://developers.webflow.com/reference/field-types-item-values).",
          optional: !field.isRequired,
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
      ...fieldData
    } = this;

    const response = await app.createCollectionItem(
      collectionId,
      {
        fieldData,
        isArchived: false,
        isDraft: false,
      },
    );

    $.export("$summary", `Successfully created collection item ${this.name ?? ""}`);

    return response;
  },
};
