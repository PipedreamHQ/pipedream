import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ebay",
  propDefinitions: {
    sku: {
      type: "string",
      label: "SKU",
      description: "The seller-defined Stock Keeping Unit (SKU) identifier for the inventory item. Must be unique across the seller's inventory.",
    },
    marketplaceId: {
      type: "string",
      label: "Marketplace ID",
      description: "The eBay marketplace where the item will be listed.",
      options: constants.MARKETPLACE_ID_OPTIONS,
      default: "EBAY_US",
    },
    offerId: {
      type: "string",
      label: "Offer ID",
      description: "The unique identifier of the eBay offer.",
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The numeric ID of the primary eBay category in which the item will be listed.",
    },
    condition: {
      type: "string",
      label: "Condition",
      description: "The condition of the inventory item.",
      options: constants.CONDITION_OPTIONS,
      default: "NEW",
    },
    contentLanguage: {
      type: "string",
      label: "Content Language",
      description: "The language of the natural-language text in the request (e.g. `en-US`, `en-GB`, `de-DE`).",
      default: constants.DEFAULT_CONTENT_LANGUAGE,
      optional: true,
    },
    merchantLocationKey: {
      type: "string",
      label: "Merchant Location Key",
      description: "The unique key identifying the seller's inventory location.",
      async options({ page }) {
        const limit = 100;
        const offset = page * limit;
        try {
          const response = await this.getLocations({
            params: {
              limit,
              offset,
            },
          });
          const locations = response?.locations || [];
          return locations.map((loc) => ({
            label: `${loc.name || loc.merchantLocationKey} (${loc.merchantLocationKey})`,
            value: loc.merchantLocationKey,
          }));
        } catch {
          return [];
        }
      },
    },
    fulfillmentPolicyId: {
      type: "string",
      label: "Fulfillment Policy ID (Shipping)",
      description: "The unique identifier of the seller's shipping/fulfillment policy.",
      async options({ marketplaceId = "EBAY_US" }) {
        try {
          const response = await this.getFulfillmentPolicies({
            params: {
              marketplace_id: marketplaceId,
            },
          });
          const policies = response?.fulfillmentPolicies || [];
          return policies.map((policy) => ({
            label: `${policy.name} (${policy.fulfillmentPolicyId})`,
            value: policy.fulfillmentPolicyId,
          }));
        } catch {
          return [];
        }
      },
    },
    paymentPolicyId: {
      type: "string",
      label: "Payment Policy ID",
      description: "The unique identifier of the seller's payment policy.",
      async options({ marketplaceId = "EBAY_US" }) {
        try {
          const response = await this.getPaymentPolicies({
            params: {
              marketplace_id: marketplaceId,
            },
          });
          const policies = response?.paymentPolicies || [];
          return policies.map((policy) => ({
            label: `${policy.name} (${policy.paymentPolicyId})`,
            value: policy.paymentPolicyId,
          }));
        } catch {
          return [];
        }
      },
    },
    returnPolicyId: {
      type: "string",
      label: "Return Policy ID",
      description: "The unique identifier of the seller's return policy.",
      async options({ marketplaceId = "EBAY_US" }) {
        try {
          const response = await this.getReturnPolicies({
            params: {
              marketplace_id: marketplaceId,
            },
          });
          const policies = response?.returnPolicies || [];
          return policies.map((policy) => ({
            label: `${policy.name} (${policy.returnPolicyId})`,
            value: policy.returnPolicyId,
          }));
        } catch {
          return [];
        }
      },
    },
  },
  methods: {
    _baseUrl() {
      return constants.BASE_URL;
    },
    _headers(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...args,
      });
    },
    createOrReplaceInventoryItem({
      $,
      sku,
      contentLanguage = constants.DEFAULT_CONTENT_LANGUAGE,
      data,
    }) {
      return this._makeRequest({
        $,
        path: `/sell/inventory/v1/inventory_item/${encodeURIComponent(sku)}`,
        method: "PUT",
        headers: {
          "Content-Language": contentLanguage,
        },
        data,
      });
    },
    getInventoryItem({
      $,
      sku,
    }) {
      return this._makeRequest({
        $,
        path: `/sell/inventory/v1/inventory_item/${encodeURIComponent(sku)}`,
        method: "GET",
      });
    },
    createOffer({
      $,
      contentLanguage = constants.DEFAULT_CONTENT_LANGUAGE,
      data,
    }) {
      return this._makeRequest({
        $,
        path: "/sell/inventory/v1/offer",
        method: "POST",
        headers: {
          "Content-Language": contentLanguage,
        },
        data,
      });
    },
    getOffer({
      $,
      offerId,
    }) {
      return this._makeRequest({
        $,
        path: `/sell/inventory/v1/offer/${encodeURIComponent(offerId)}`,
        method: "GET",
      });
    },
    publishOffer({
      $,
      offerId,
    }) {
      return this._makeRequest({
        $,
        path: `/sell/inventory/v1/offer/${encodeURIComponent(offerId)}/publish`,
        method: "POST",
      });
    },
    getLocations({
      $,
      params,
    } = {}) {
      return this._makeRequest({
        $,
        path: "/sell/inventory/v1/location",
        method: "GET",
        params,
      });
    },
    getFulfillmentPolicies({
      $,
      params,
    } = {}) {
      return this._makeRequest({
        $,
        path: "/sell/account/v1/fulfillment_policy",
        method: "GET",
        params,
      });
    },
    getPaymentPolicies({
      $,
      params,
    } = {}) {
      return this._makeRequest({
        $,
        path: "/sell/account/v1/payment_policy",
        method: "GET",
        params,
      });
    },
    getReturnPolicies({
      $,
      params,
    } = {}) {
      return this._makeRequest({
        $,
        path: "/sell/account/v1/return_policy",
        method: "GET",
        params,
      });
    },
  },
};