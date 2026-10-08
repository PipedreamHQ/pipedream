import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ebay",
  propDefinitions: {
    sku: {
      type: "string",
      label: "SKU",
      description: "The seller-defined Stock Keeping Unit (SKU) identifier for the inventory item (e.g. `SKU-12345` or `SHIRT-BLUE-M`). Must be unique across the seller's inventory.",
    },
    marketplaceId: {
      type: "string",
      label: "Marketplace ID",
      description: "The eBay marketplace where the item will be listed (e.g. `EBAY_US`, `EBAY_GB`).",
      options: constants.MARKETPLACE_ID_OPTIONS,
      default: "EBAY_US",
    },
    offerId: {
      type: "string",
      label: "Offer ID",
      description: "The unique identifier of the eBay offer (e.g. `123456789012`).",
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The numeric ID of the primary eBay category in which the item will be listed (e.g. `9355` for Cell Phones & Smartphones).",
    },
    condition: {
      type: "string",
      label: "Condition",
      description: "The condition of the inventory item (e.g. `NEW`, `LIKE_NEW`, `USED_EXCELLENT`).",
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
      description: "The unique key identifying the seller's inventory location (e.g. `warehouse-1`).",
      async options({ page }) {
        const limit = 100;
        const offset = page * limit;
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
      },
    },
    fulfillmentPolicyId: {
      type: "string",
      label: "Fulfillment Policy ID (Shipping)",
      description: "The unique identifier of the seller's shipping/fulfillment policy (e.g. `60000000000`).",
      async options({ marketplaceId = "EBAY_US" }) {
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
      },
    },
    paymentPolicyId: {
      type: "string",
      label: "Payment Policy ID",
      description: "The unique identifier of the seller's payment policy (e.g. `60000000000`).",
      async options({ marketplaceId = "EBAY_US" }) {
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
      },
    },
    returnPolicyId: {
      type: "string",
      label: "Return Policy ID",
      description: "The unique identifier of the seller's return policy (e.g. `60000000000`).",
      async options({ marketplaceId = "EBAY_US" }) {
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
      },
    },
  },
  methods: {
    /**
     * Returns the base URL for the eBay REST APIs.
     *
     * @returns {string} The base API URL.
     */
    _baseUrl() {
      return constants.BASE_URL;
    },
    /**
     * Constructs standard authorization and content-type headers for eBay API requests.
     *
     * @param {object} [headers={}] - Optional additional headers.
     * @returns {object} The request headers.
     */
    _headers(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...headers,
      };
    },
    /**
     * Makes an authenticated HTTP request to the eBay API using Pipedream's axios wrapper.
     *
     * @param {object} options - Request options.
     * @param {object} [options.$=this] - Pipedream step execution context.
     * @param {string} options.path - The API endpoint path.
     * @param {object} [options.headers] - Additional HTTP headers.
     * @returns {Promise<*>} The API response data.
     */
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
    /**
     * Creates or replaces an inventory item record for a given SKU.
     *
     * @param {object} options - Options object.
     * @param {object} [options.$] - Pipedream step execution context.
     * @param {string} options.sku - The seller-defined SKU.
     * @param {string} [options.contentLanguage="en-US"] - Language of natural language fields.
     * @param {object} options.data - The inventory item payload.
     * @returns {Promise<*>} The API response.
     */
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
    /**
     * Retrieves an existing inventory item record by its SKU.
     *
     * @param {object} options - Options object.
     * @param {object} [options.$] - Pipedream step execution context.
     * @param {string} options.sku - The seller-defined SKU.
     * @returns {Promise<*>} The inventory item record.
     */
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
    /**
     * Creates an unpublished fixed-price offer for an inventory item SKU.
     *
     * @param {object} options - Options object.
     * @param {object} [options.$] - Pipedream step execution context.
     * @param {string} [options.contentLanguage="en-US"] - Language of natural language fields.
     * @param {object} options.data - The offer payload.
     * @returns {Promise<*>} The created offer response containing offerId.
     */
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
    /**
     * Retrieves details of an existing offer by its Offer ID.
     *
     * @param {object} options - Options object.
     * @param {object} [options.$] - Pipedream step execution context.
     * @param {string} options.offerId - The offer ID.
     * @returns {Promise<*>} The offer record.
     */
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
    /**
     * Publishes an unpublished offer to convert it into an active eBay marketplace listing.
     *
     * @param {object} options - Options object.
     * @param {object} [options.$] - Pipedream step execution context.
     * @param {string} options.offerId - The offer ID to publish.
     * @returns {Promise<*>} The publish response containing listingId.
     */
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
    /**
     * Retrieves the seller's inventory locations.
     *
     * @param {object} [options] - Options object.
     * @param {object} [options.$] - Pipedream step execution context.
     * @param {object} [options.params] - Query parameters (limit, offset).
     * @returns {Promise<*>} The locations response.
     */
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
    /**
     * Retrieves the seller's fulfillment (shipping) policies for a marketplace.
     *
     * @param {object} [options] - Options object.
     * @param {object} [options.$] - Pipedream step execution context.
     * @param {object} [options.params] - Query parameters (marketplace_id).
     * @returns {Promise<*>} The fulfillment policies response.
     */
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
    /**
     * Retrieves the seller's payment policies for a marketplace.
     *
     * @param {object} [options] - Options object.
     * @param {object} [options.$] - Pipedream step execution context.
     * @param {object} [options.params] - Query parameters (marketplace_id).
     * @returns {Promise<*>} The payment policies response.
     */
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
    /**
     * Retrieves the seller's return policies for a marketplace.
     *
     * @param {object} [options] - Options object.
     * @param {object} [options.$] - Pipedream step execution context.
     * @param {object} [options.params] - Query parameters (marketplace_id).
     * @returns {Promise<*>} The return policies response.
     */
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