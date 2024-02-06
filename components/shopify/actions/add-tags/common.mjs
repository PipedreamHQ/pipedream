export default {
  props: {
    resource: {
      label: "Resource Type",
      type: "string",
      description: "The Shopify Admin API resource type.",
      options: [
        "Product",
        "Customer",
        "Order",
        "DraftOrder",
        "OnlineStoreArticle",
      ],
    },
    id: {
      label: "Resource ID",
      type: "string",
      description:
        "The Shopify Admin Resource ID. For example, the ID of a Product, Customer, Order, DraftOrder, or OnlineStoreArticle. Can be found at the end of the URL in Shopify Admin.",
    },
    tags: {
      label: "Tags",
      type: "string",
      description: "Separate tags with a comma to add multiple tags.",
    },
  },
  async run({ $ }) {
    const {
      resource,
      id,
      tags,
    } = this;

    const res = await this.shopify.addTags(resource, id, tags);

    if (res.tagsAdd.userErrors.length > 0) {
      throw new Error(res.tagsAdd.userErrors[0].message);
    }

    $.export(
      "$summary",
      `Added tag(s) \`${tags}\` with id \`${res.tagsAdd.node.id}\``,
    );
    return res;
  },
};
