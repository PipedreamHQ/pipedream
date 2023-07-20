import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "etsy",
  propDefinitions: {
    listingId: {
      type: "string",
      label: "Listing ID",
      description: "The ID of the listing.",
      async options({ page, prevContext }) {
        let shopId = prevContext.shopId;

        if (!shopId) {
          ({ shop_id: shopId } = await this.getMe());
        }

        const { results } = await this.getListingsByShop({
          shopId,
          params: {
            limit: constants.DEFAULT_LIMIT,
            sort_on: "created",
            offset: constants.DEFAULT_LIMIT * page,
          }
        });

        const options = results?.map(({
          listing_id: value, title: label
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            shopId,
          },
        };
      },
    },
    propertyId: {
      type: "string",
      label: "Property ID",
      description: "The ID of the property.",
      async options({ listingId, prevContext }) {
        let shopId = prevContext.shopId;

        if (!shopId) {
          ({ shop_id: shopId } = await this.getMe());
        }

        const { results } = await this.getListingProperties({
          shopId,
          listingId,
        });

        const options = results?.map(({
          property_id: value, property_name: label
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            shopId,
          },
        };
      },
    },
    valueIds: {
      type: "integer[]",
      label: "Value IDs",
      description: "An array of unique IDs of multiple Etsy listing property values. For example, if your listing offers different sizes of a product, then the value ID list contains value IDs for each size.",
      async options({ listingId, propertyId }) {
        const { value_ids: valueIds } =
          await this.getListingProperty({
            listingId,
            propertyId,
          });
        return valueIds;
      },
    },
    values: {
      type: "string[]",
      label: "Values",
      description: "An array of value strings for multiple Etsy listing property values. For example, if your listing offers different colored products, then the values array contains the color strings for each color. Note: parenthesis characters (( and )) are not allowed.",
      async options({ listingId, propertyId }) {
        const { values } =
          await this.getListingProperty({
            listingId,
            propertyId,
          });
        return values;
      },
    },
    taxonomyType: {
      type: "string",
      label: "Taxonomy Type",
      description: "The type of taxonomy.",
      options: Object.values(constants.TAXONOMY_TYPE),
    },
    taxonomyId: {
      type: "string",
      label: "Taxonomy ID",
      description: "The numerical taxonomy ID of the listing.",
      async options({ taxonomyType = constants.TAXONOMY_TYPE.SELLER }) {
        const promise = taxonomyType === constants.TAXONOMY_TYPE.SELLER
          ? this.getSellerTaxonomyNodes()
          : this.getBuyerTaxonomyNodes();
        
        const { results } = await promise;

        return results?.map(({
          id: value, name: label
        }) => ({
          label: `${label} (${taxonomyType})`,
          value,
        }));
      },
    },
    listingType: {
      type: "string",
      label: "Listing Type",
      description: "An enumerated type string that indicates whether the listing is `physical` or a digital `download`.",
      options: Object.values(constants.LISTING_TYPE),
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "x-api-key": this.$auth.oauth_client_id,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };
      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    getMe(args = {}) {
      return this.makeRequest({
        path: "/application/users/me",
        ...args,
      });
    },
    getShopReceiptTransactionsByShop({
      shopId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/application/shops/${shopId}/transactions`,
        ...args,
      });
    },
    getShopReceipts({
      shopId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/application/shops/${shopId}/receipts`,
        ...args,
      });
    },
    getListingsByShop({
      shopId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/application/shops/${shopId}/listings`,
        ...args,
      });
    },
    getListingProperties({
      shopId, listingId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/application/shops/${shopId}/listings/${listingId}/properties`,
        ...args,
      });
    },
    getListingProperty({
      listingId, propertyId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/application/listings/${listingId}/properties/${propertyId}`,
        ...args,
      });
    },
    getBuyerTaxonomyNodes(args = {}) {
      return this.makeRequest({
        path: `/application/buyer-taxonomy/nodes`,
        ... args,
      });
    },
    getSellerTaxonomyNodes(args = {}) {
      return this.makeRequest({
        path: `/application/seller-taxonomy/nodes`,
        ... args,
      });
    },
    getShopShippingProfiles({
      shopId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/application/shops/${shopId}/shipping-profiles`,
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              offset,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;
          
          if (resourcesCount >= max) {
            return;
          }
        }

        offset += nextResources.length;
      }
    },
  },
};
