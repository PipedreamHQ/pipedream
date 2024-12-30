import metafieldActions from "../common/metafield-actions.mjs";
import common from "@pipedream/shopify/actions/update-metafield/common.mjs";
import shopify from "@pipedream/shopify/shopify.app.mjs";

export default {
  ...common,
  key: "shopify_developer_app-update-metafield",
  name: "Update Metafield",
  description: "Updates a metafield belonging to a resource. [See the docs](https://shopify.dev/api/admin-rest/2023-01/resources/metafield#put-blogs-blog-id-metafields-metafield-id)",
  version: "0.0.5",
  type: "action",
  props: {
    ...metafieldActions.props,
    ...common.props,
  },
  async additionalProps() {
    const props = await this.getOwnerIdProp(this.ownerResource);

    props.metafieldId = {
      type: "string",
      label: "Metafield ID",
      description: "The metafield to update",
    };
    props.value = {
      type: "string",
      label: "Value",
      description: "The data to store in the metafield",
    };

    return props;
  },
  methods: {
    ...metafieldActions.methods,
    ...common.methods,
    async getOwnerIdProp(ownerResource) {
      const resources = {
        product: shopify.propDefinitions.productId,
        variants: shopify.propDefinitions.productVariantId,
        product_image: {
          ...shopify.propDefinitions.imageId,
          optional: false,
        },
        customer: shopify.propDefinitions.customerId,
        collection: {
          ...shopify.propDefinitions.collectionId,
          optional: false,
        },
        blog: shopify.propDefinitions.blogId,
        article: shopify.propDefinitions.articleId,
        page: shopify.propDefinitions.pageId,
        order: shopify.propDefinitions.orderId,
        draft_order: shopify.propDefinitions.draftOrderId,
      };

      const props = {};

      if (ownerResource === "variants" || ownerResource === "product_image") {
        props.productId = resources.product;
      }
      if (ownerResource === "article") {
        props.blogId = resources.blog;
      }

      Object.values(resources).forEach((resource) => {
        delete resource.options;
      });
      Object.values(props).forEach((prop) => {
        delete prop.options;
      });

      return {
        ...props,
        ownerId: resources[ownerResource],
      };
    },
  },
};
