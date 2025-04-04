import shopify from "../../shopify_developer_app.app.mjs";
import constants from "./constants.mjs";
import utils from "@pipedream/shopify/common/utils.mjs";
import { MAX_LIMIT } from "@pipedream/shopify/common/constants.mjs";

export default {
  props: {
    shopify,
    ownerResource: {
      type: "string",
      label: "Resource Type",
      description: "Filter by the resource type on which the metafield is attached to",
      options: constants.RESOURCE_TYPES,
      reloadProps: true,
    },
  },
  methods: {
    async getOwnerIdProp(ownerResource) {
      const resources = {
        product: {
          ...shopify.propDefinitions.productId,
          options: async ({ prevContext }) => {
            return this.shopify.getPropOptions({
              resourceFn: this.shopify.listProducts,
              resourceKeys: [
                "products",
              ],
              prevContext,
            });
          },
        },
        variants: {
          ...shopify.propDefinitions.productVariantId,
          options: async ({ prevContext }) => {
            return this.shopify.getPropOptions({
              resourceFn: this.shopify.listProductVariants,
              resourceKeys: [
                "productVariants",
              ],
              variables: {
                query: `product_id:${this.productId.split("/").pop()}`,
              },
              prevContext,
            });
          },
        },
        collection: {
          ...shopify.propDefinitions.collectionId,
          options: async ({ prevContext }) => {
            return this.shopify.getPropOptions({
              resourceFn: this.shopify.listCollections,
              resourceKeys: [
                "collections",
              ],
              prevContext,
            });
          },
          optional: false,
        },
        blog: {
          ...shopify.propDefinitions.blogId,
          options: async ({ prevContext }) => {
            return this.shopify.getPropOptions({
              resourceFn: this.shopify.listBlogs,
              resourceKeys: [
                "blogs",
              ],
              prevContext,
            });
          },
        },
        article: {
          ...shopify.propDefinitions.articleId,
          options: async ({ prevContext }) => {
            return this.shopify.getPropOptions({
              resourceFn: this.shopify.listBlogArticles,
              resourceKeys: [
                "blog",
                "articles",
              ],
              variables: {
                id: this.blogId,
              },
              prevContext,
            });
          },
        },
        page: {
          ...shopify.propDefinitions.pageId,
          options: async ({ prevContext }) => {
            return this.shopify.getPropOptions({
              resourceFn: this.shopify.listPages,
              resourceKeys: [
                "pages",
              ],
              prevContext,
            });
          },
        },
        customer: {
          ...shopify.propDefinitions.customerId,
          options: async ({ prevContext }) => {
            return this.shopify.getPropOptions({
              resourceFn: this.shopify.listCustomers,
              resourceKeys: [
                "customers",
              ],
              labelKey: "displayName",
              prevContext,
            });
          },
        },
        draftOrder: {
          type: "string",
          label: "Draft Order ID",
          description: "The identifier of a draft order",
          options: async ({ prevContext }) => {
            return this.shopify.getPropOptions({
              resourceFn: this.shopify.listDraftOrders,
              resourceKeys: [
                "draftOrders",
              ],
              labelKey: "id",
              prevContext,
            });
          },
        },
        order: {
          ...shopify.propDefinitions.orderId,
          options: async ({ prevContext }) => {
            return this.shopify.getPropOptions({
              resourceFn: this.shopify.listOrders,
              resourceKeys: [
                "orders",
              ],
              labelKey: "id",
              prevContext,
            });
          },
        },
      };

      const props = {};

      if (ownerResource === "variants") {
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
    async getMetafields({
      resourceFn, resourceKeys = [], variables,
    }) {
      let results = await resourceFn(variables);
      for (const key of resourceKeys) {
        results = results[key];
      }
      return results.metafields.nodes;
    },
    async listMetafields(ownerResource, ownerId) {
      const variables = {
        id: ownerId,
        first: MAX_LIMIT,
      };
      let resourceFn, resourceKeys;
      if (ownerResource === "product") {
        resourceFn = this.shopify.getProduct;
        resourceKeys = [
          "product",
        ];
      }
      if (ownerResource === "variants") {
        resourceFn = this.shopify.getProductVariant;
        resourceKeys = [
          "productVariant",
        ];
      }
      if (ownerResource === "collection") {
        resourceFn = this.shopify.getCollection;
        resourceKeys = [
          "collection",
        ];
      }
      if (ownerResource === "blog") {
        resourceFn = this.shopify.getBlog;
        resourceKeys = [
          "blog",
        ];
      }
      if (ownerResource === "article") {
        resourceFn = this.shopify.getArticle;
        resourceKeys = [
          "article",
        ];
      }
      if (ownerResource === "page") {
        resourceFn = this.shopify.getPage;
        resourceKeys = [
          "page",
        ];
      }
      if (ownerResource === "customer") {
        resourceFn = this.shopify.getCustomer;
        resourceKeys = [
          "customer",
        ];
      }
      if (ownerResource === "draftOrder") {
        resourceFn = this.shopify.getDraftOrder;
        resourceKeys = [
          "draftOrder",
        ];
      }
      if (ownerResource === "order") {
        resourceFn = this.shopify.getOrder;
        resourceKeys = [
          "order",
        ];
      }

      return this.getMetafields({
        resourceFn,
        resourceKeys,
        variables,
      });
    },
    async getMetafieldIdByKey(key, namespace, ownerId, ownerResource) {
      const results = await this.listMetafields(ownerResource, ownerId);

      const metafield = results?.filter(
        (field) => field.key === key && field.namespace === namespace,
      );
      if (!metafield || metafield.length === 0) {
        return false;
      }
      return metafield[0].id;
    },
    async createMetafieldsArray(metafieldsOriginal, ownerId, ownerResource) {
      if (!metafieldsOriginal) {
        return;
      }
      const metafields = [];
      const metafieldsArray = utils.parseJson(metafieldsOriginal);
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
