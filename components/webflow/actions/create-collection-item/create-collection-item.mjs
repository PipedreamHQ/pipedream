import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-create-collection-item",
  name: "Create Collection Item",
  description: "Create new collection item. [See the docs here](https://developers.webflow.com/#create-new-collection-item)",
  version: "1.0.1",
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
    live: {
      label: "Live",
      description: "Indicate if the item should be published to the live site",
      type: "boolean",
      default: false,
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
              ? "URL structure of the Item in your site."
              : "See the documentation for additional information about [Field Types & Item Values](https://developers.webflow.com/reference/field-types-item-values).",
          optional: !field.required,
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
      // eslint-disable-next-line no-unused-vars
      collectionId,
      live,
      ...fields
    } = this;

    const webflowClient = webflow._createApiClient();

    const response = await webflowClient.createItem({
      collectionId: this.collectionId,
      fields: {
        ...fields,
        _archived: false,
        _draft: false,
      },
    }, {
      live,
    });

    $.export("$summary", `Successfully created collection item ${fields.name}`);

    return response;
  },
};
