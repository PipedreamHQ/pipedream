import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "printify",
  propDefinitions: {
    description: {
      type: "string",
      label: "Description",
      description: "A description of the product. Supports HTML formatting.",
    },
    blueprintId: {
      type: "string",
      label: "Blueprint Id",
      description: "The blueprint of the product to create.",
      async options() {
        const data = await this.listBlueprints();

        return data.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    printAreas: {
      type: "string[]",
      label: "Print Areas",
      description: "A list of placeholder objects. [See the documentation](https://developers.printify.com/#create-a-new-product)",
    },
    variants: {
      type: "string[]",
      label: "Variants",
      description: "A list of variant objects. [See the documentation](https://developers.printify.com/#create-a-new-product)",
    },
    printAreaVariantId: {
      type: "string[]",
      label: "Print Area Variant Id",
      description: "The variant Ids of the blueprint from a specific print provider.",
      async options({
        blueprintId, printProviderId,
      }) {
        const { variants } = await this.listVariants({
          blueprintId,
          printProviderId,
        });

        return variants.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    printProviderId: {
      type: "string",
      label: "Print Provider Id",
      description: "The print provider that fulfill orders for a specific blueprint.",
      async options({ blueprintId }) {
        const data = await this.listPrintProviders({
          blueprintId,
        });

        return data.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The unique identifier for the product.",
      async options({
        page, shopId,
      }) {
        const { data } = await this.listProducts({
          shopId,
          params: {
            limit: LIMIT,
            page: page + 1,
          },
        });

        return data.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    shopId: {
      type: "string",
      label: "Shop ID",
      description: "The ID of the merchant's store.",
      async options() {
        const data = await this.listShops();

        return data.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags are also published to sales channel.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The name of the product.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.printify.com/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    createProduct({
      shopId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/shops/${shopId}/products.json`,
        ...opts,
      });
    },
    listBlueprints() {
      return this._makeRequest({
        path: "/catalog/blueprints.json",
      });
    },
    listPrintProviders({ blueprintId }) {
      return this._makeRequest({
        path: `/catalog/blueprints/${blueprintId}/print_providers.json`,
      });
    },
    listPrintProviderVariants({
      blueprintId, printProviderId,
    }) {
      return this._makeRequest({
        path: `/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/variants.json`,
      });
    },
    listProducts({
      shopId, ...opts
    }) {
      return this._makeRequest({
        path: `/shops/${shopId}/products.json`,
        ...opts,
      });
    },
    listShops() {
      return this._makeRequest({
        path: "/shops.json",
      });
    },
    updateProduct({
      shopId, productId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/shops/${shopId}/products/${productId}.json`,
        ...opts,
      });
    },
    createHook({
      shopId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/shops/${shopId}/webhooks.json`,
        ...opts,
      });
    },
    deleteHook({
      shopId, webhookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/shops/${shopId}/webhooks/${webhookId}.json`,
      });
    },
    submitOrder({
      shopId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/shops/${shopId}/orders.json`,
        ...opts,
      });
    },
    uploadImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/uploads/images.json",
        ...opts,
      });
    },
  },
};
