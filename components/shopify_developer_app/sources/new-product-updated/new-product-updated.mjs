import common from "../common/webhook-metafields.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-product-updated",
  name: "New Product Updated (Instant)",
  description: "Emit new event for each product updated in a store.",
  version: "0.0.12",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    productType: {
      type: "string",
      label: "Product Type",
      description: "Filter results by product type",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Filter results by product tag(s)",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTopic() {
      return "PRODUCTS_UPDATE";
    },
    isRelevant(resource) {
      let relevant = true;
      if (this.productType && resource.productType !== this.productType) {
        relevant = false;
      }
      if (this.tags?.length) {
        this.tags.forEach((tag) => {
          if (!resource.tags?.includes(tag)) {
            relevant = false;
          }
        });
      }
      return relevant;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Product Updated ${resource.id}`,
        ts,
      };
    },
  },
};
