import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "wix_api_key",
  propDefinitions: {
    site: {
      type: "string",
      label: "Site",
      description: "Identifier of a site",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          offset: page * limit,
        };
        const { sites } = await this.listSites({
          params,
        });
        return sites?.map(({
          id, displayName,
        }) => ({
          value: id,
          label: displayName,
        })) || [];
      },
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "List of contact labels",
      async options({
        page, siteId,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          "paging.limit": limit,
          "paging.offset": page * limit,
        };
        const { labels } = await this.listLabels({
          siteId,
          params,
        });
        return labels?.map(({
          key, displayName,
        }) => ({
          value: key,
          label: displayName,
        })) || [];
      },
    },
    collection: {
      type: "string",
      label: "Collection",
      description: "The collection to add product to",
      async options({
        page, siteId,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        const data = {
          query: {
            paging: {
              limit,
              offset: page * limit,
            },
          },
        };
        const { collections } = await this.listCollections({
          siteId,
          data,
        });
        // remove default "All Products" category
        return collections?.filter(({ id }) => id !== constants.ALL_PRODUCTS_CATEGORY_ID)?.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        })) || [];
      },
    },
    products: {
      type: "string[]",
      label: "Products",
      description: "Products to add to a collection",
      async options({
        page, siteId,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        const data = {
          query: {
            paging: {
              limit,
              offset: page * limit,
            },
          },
        };
        const { products } = await this.listProducts({
          siteId,
          data,
        });
        return products?.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        })) || [];
      },
    },
    contact: {
      type: "string",
      label: "Contact",
      description: "The identifier of a contact",
      async options({
        page, siteId,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          "paging.limit": limit,
          "paging.offset": page * limit,
        };
        const { contacts } = await this.listContacts({
          siteId,
          params,
        });
        return contacts?.map(({
          id, info,
        }) => ({
          value: id,
          label: info.name
            ? `${info.name.first} ${info.name.last}`
            : id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.wixapis.com";
    },
    async _headers(siteId) {
      return {
        ...(await this.getSiteHeaders(siteId)),
        "Authorization": `${this.$auth.api_key}`,
      };
    },
    async getSiteHeaders(siteId) {
      if (!siteId) {
        return {};
      }
      const accountId = await this.getSiteAccountId(siteId);
      return {
        "wix-site-id": siteId,
        "wix-account-id": accountId,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      siteId,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: await this._headers(siteId),
        ...args,
      });
    },
    async getSiteAccountId(siteId) {
      const { sites } = await this.listSites({
        data: {
          query: {
            filter: {
              id: {
                "$in": [
                  siteId,
                ],
              },
            },
          },
        },
      });
      return sites[0].ownerAccountId;
    },
    async getContact({
      contactId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/contacts/v4/contacts/${contactId}`,
        ...args,
      });
    },
    listSites(args = {}) {
      return this._makeRequest({
        path: "/site-list/v2/sites/query",
        method: "POST",
        ...args,
      });
    },
    listMembers(args = {}) {
      return this._makeRequest({
        path: "/members/v1/members",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts/v4/contacts",
        ...args,
      });
    },
    listProducts(args = {}) {
      return this._makeRequest({
        path: "/stores/v1/products/query",
        method: "POST",
        ...args,
      });
    },
    listOrders(args = {}) {
      return this._makeRequest({
        path: "/stores/v2/orders/query",
        method: "POST",
        ...args,
      });
    },
    listLabels(args = {}) {
      return this._makeRequest({
        path: "/contacts/v4/labels",
        ...args,
      });
    },
    listCollections(args = {}) {
      return this._makeRequest({
        path: "/stores/v1/collections/query",
        method: "POST",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts/v4/contacts",
        method: "POST",
        ...args,
      });
    },
    createProduct(args = {}) {
      return this._makeRequest({
        path: "/stores/v1/products",
        method: "POST",
        ...args,
      });
    },
    addProductsToCollection({
      collectionId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/stores/v1/collections/${collectionId}/productIds`,
        method: "POST",
        ...args,
      });
    },
  },
};
