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
      const resources = {
        product: {
          ...shopify.propDefinitions.productId,
          options: async ({ prevContext }) => {
            return this.shopify.getProductOptions(prevContext);
          },
        },
        variants: {
          ...shopify.propDefinitions.productVariantId,
          options: async ({ prevContext }) => {
            return this.shopify.getProductVariantOptions(this.productId, prevContext);
          },
        },
        product_image: {
          ...shopify.propDefinitions.imageId,
          options: async() => {
            return this.shopify.getImageOptions(this.productId);
          },
          optional: false,
        },
        customer: {
          ...shopify.propDefinitions.customerId,
          options: async ({
            prevContext, query,
          }) => {
            return this.shopify.getCustomerOptions(prevContext, query);
          },
        },
        collection: {
          ...shopify.propDefinitions.collectionId,
          options: async () => {
            return this.shopify.getCollectionOptions();
          },
          optional: false,
        },
        blog: {
          ...shopify.propDefinitions.blogId,
          options: async () => {
            return this.shopify.getBlogOptions();
          },
        },
        article: {
          ...shopify.propDefinitions.articleId,
          options: async () => {
            return this.shopify.getArticleOptions(this.blogId);
          },
        },
        page: {
          ...shopify.propDefinitions.pageId,
          options: async () => {
            return this.shopify.getPageOptions();
          },
        },
        order: {
          ...shopify.propDefinitions.orderId,
          options: async () => {
            return this.shopify.getOrderOptions();
          },
        },
        draft_order: {
          ...shopify.propDefinitions.draftOrderId,
          options: async () => {
            return this.shopify.getDraftOrderOptions();
          },
        },
      };

      const props = {};

      if (ownerResource === "variants" || ownerResource === "product_image") {
        props.productId = resources.product;
      }
      if (ownerResource === "article") {
        props.blogId = resources.blog;
      }

      return {
        ...props,
        ownerId: resources[ownerResource],
      };
    },
    async getMetafieldIdByKey(key, namespace, ownerId, ownerResource) {
      const results = await this.shopify.listMetafields({
        metafield: {
          owner_resource: ownerResource,
          owner_id: ownerId,
        },
      });
      const metafield = results?.filter(
        (field) => field.key === key && field.namespace === namespace,
      );
      if (!metafield || metafield.length === 0) {
        return false;
      }
      return metafield[0].id;
    },
    async createMetafieldsArray(metafieldsOriginal, ownerId, ownerResource) {
      const metafields = [];
      const metafieldsArray = this.shopify.parseArrayOfJSONStrings(metafieldsOriginal);
      for (const meta of metafieldsArray) {
        if (meta.id) {
          metafields.push(meta);
          continue;
        }
        const metafieldId = await this.getMetafieldIdByKey(
          meta.key, meta.namespace, ownerId, ownerResource,
        );
        if (!metafieldId) {
          metafields.push(meta);
          continue;
        }
        metafields.push({
          id: `${metafieldId}`,
          value: meta.value,
        });
      }
      return metafields;
    },
  },
};
