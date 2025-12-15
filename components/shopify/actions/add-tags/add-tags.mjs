import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-add-tags",
  name: "Add Tags",
  description: "Add tags. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/tagsAdd)",
  version: "0.0.15",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
    resource: {
      type: "string",
      label: "Resource Type",
      description: "The Shopify Admin API resource type.",
      options: [
        "Product",
        "Customer",
        "Order",
        "DraftOrder",
        "Article",
      ],
      reloadProps: true,
    },
    gid: {
      type: "string",
      label: "Resource ID",
      description: "The Shopify Admin Resource ID. For example, the ID of a Product, Customer, Order, DraftOrder, or OnlineStoreArticle. Can be found at the end of the URL in Shopify Admin.",
    },
    tags: {
      propDefinition: [
        shopify,
        "tags",
      ],
    },
  },
  async additionalProps(existingProps) {
    const props = {};
    if (!this.resource) {
      return props;
    }
    if (this.resource === "Product") {
      props.gid = {
        ...existingProps.gid,
        options: async ({ prevContext }) => {
          try {
            return await this.shopify.getPropOptions({
              resourceFn: this.shopify.listProducts,
              resourceKeys: [
                "products",
              ],
              prevContext,
            });
          } catch {
            console.log("Unable to fetch product options");
          }
        },
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.shopify.addTags({
      gid: this.gid,
      tags: this.tags,
    });
    if (response.tagsAdd.userErrors.length > 0) {
      throw new Error(response.tagsAdd.userErrors[0].message);
    }
    $.export("$summary", `Added tag(s) \`${this.tags}\` with id \`${response.tagsAdd.node.id}\``);
    return response;
  },
};
