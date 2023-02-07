import shopify from "../../shopify.app.mjs";
import consts from "../common/consts.mjs";

export default {
  props: {
    shopify,
    ownerResource: {
      type: "string",
      label: "Resource Type",
      description: "Filter by the resource type on which the metafield is attached to",
      options: consts.RESOURCE_TYPES,
      reloadProps: true,
    },
  },
  methods: {
    async getOwnerIdProp(ownerResource) {
      const product = {
        ...shopify.propDefinitions.productId,
        options: async ({ prevContext }) => {
          return this.shopify.getProductOptions(prevContext);
        },
      };
      const productVariant = {
        ...shopify.propDefinitions.productVariantId,
        options: async ({ prevContext }) => {
          return this.shopify.getProductVariantOptions(this.productId, prevContext);
        },
      };
      const productImage = {
        ...shopify.propDefinitions.imageId,
        options: async() => {
          return this.shopify.getImageOptions(this.productId);
        },
        optional: false,
      };
      const customer = {
        ...shopify.propDefinitions.customerId,
        options: async ({
          prevContext, query,
        }) => {
          return this.shopify.getCustomerOptions(prevContext, query);
        },
      };
      const collection = {
        ...shopify.propDefinitions.collectionId,
        options: async () => {
          return this.shopify.getCollectionOptions();
        },
        optional: false,
      };
      const blog = {
        ...shopify.propDefinitions.blogId,
        options: async () => {
          return this.shopify.getBlogOptions();
        },
      };
      const article = {
        ...shopify.propDefinitions.articleId,
        options: async () => {
          return this.shopify.getArticleOptions(this.blogId);
        },
      };
      const page = {
        ...shopify.propDefinitions.pageId,
        options: async () => {
          return this.shopify.getPageOptions();
        },
      };
      const order = {
        ...shopify.propDefinitions.orderId,
        options: async () => {
          return this.shopify.getOrderOptions();
        },
      };
      const draftOrder = {
        ...shopify.propDefinitions.draftOrderId,
        options: async () => {
          return this.shopify.getDraftOrderOptions();
        },
      };

      let props = {};
      if (ownerResource === "product") {
        props = {
          ownerId: product,
        };
      }
      if (ownerResource === "variants") {
        props = {
          productId: product,
          ownerId: productVariant,
        };
      }
      if (ownerResource === "product_image") {
        props = {
          productId: product,
          ownerId: productImage,
        };
      }
      if (ownerResource === "customer") {
        props = {
          ownerId: customer,
        };
      }
      if (ownerResource === "collection") {
        props = {
          ownerId: collection,
        };
      }
      if (ownerResource === "blog") {
        props = {
          ownerId: blog,
        };
      }
      if (ownerResource === "article") {
        props = {
          blogId: blog,
          ownerId: article,
        };
      }
      if (ownerResource === "page") {
        props = {
          ownerId: page,
        };
      }
      if (ownerResource === "order") {
        props = {
          ownerId: order,
        };
      }
      if (ownerResource === "draft_order") {
        props = {
          ownerId: draftOrder,
        };
      }
      return props;
    },
  },
};
