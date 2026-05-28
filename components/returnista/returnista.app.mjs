import { axios } from "@pipedream/platform";
import { COUNTRY_CODE_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "returnista",
  propDefinitions: {
    consumerId: {
      type: "string",
      label: "Consumer ID",
      description: "The ID of the consumer",
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the account",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of objects to return per page",
      default: 20,
      min: 1,
      max: 50,
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return",
      default: 1,
      min: 1,
      max: 9007199254740991,
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "A filter to apply to the results. Supports filtering by purchaseOrderNumber, status, createdAt, updatedAt, store, and other fields. For date filters, use operators: >, <, >=, <= (e.g., createdAt>2024-05-24T12:05:15.264Z). For other filters, use colon format (e.g., purchaseOrderNumber:12345)",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "A search string to filter the results. Searches across purchase order numbers, consumer first name, last name, email, and consumer full name. Examples: search=12345 ┃ search=john@example.com",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The field to sort the results by",
      options: [
        "createdAt",
        "updatedAt",
      ],
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "The order to sort the results by",
      options: [
        "desc",
        "asc",
      ],
      optional: true,
    },
    returnOrderId: {
      type: "string",
      label: "Return Order ID",
      description: "The ID of the return order",
      async options({ accountId }) {
        const { data } = await this.getReturnOrders({
          accountId,
        });
        return data.map(({ id }) => ({
          label: `Return Order ID: ${id}`,
          value: id,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the return location",
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street of the return location",
    },
    houseNumber: {
      type: "string",
      label: "House Number",
      description: "The house number of the return location",
    },
    suffix: {
      type: "string",
      label: "Suffix",
      description: "The suffix of the return location",
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the return location",
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the return location",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country code of the return location",
      options: COUNTRY_CODE_OPTIONS,
    },
    stateProvinceCode: {
      type: "string",
      label: "State Province Code",
      description: "The state province code of the return location",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name associated with the Return Location",
    },
    attention: {
      type: "string",
      label: "Attention",
      description: "The attention line for the Return Location. This is typically used to direct the return to a specific department or individual within the organization",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number associated with the Return Location",
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "A contact name associated with the Return Location",
    },
    returnLocationId: {
      type: "string",
      label: "Return Location ID",
      description: "The ID of the return location to get",
      async options({ accountId }) {
        const { data: returnLocations = [] } = await this.getReturnLocations({
          accountId,
        });
        return returnLocations.map(({
          id, name,
        }) => ({
          label: `${name} (${id})`,
          value: id,
        }));
      },
    },
    returnRequestId: {
      type: "string",
      label: "Return Request ID",
      description: "The ID of the return request to get",
      async options({ accountId }) {
        const { data: returnRequests = [] } = await this.getReturnRequests({
          accountId,
        });
        return returnRequests.map(({
          id, purchaseOrderNumber, returnReasonComment,
        }) => ({
          label: `${purchaseOrderNumber}${returnReasonComment
            ? ` - ${returnReasonComment}`
            : ""}`,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://core.returnista.com/api/v0";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    getConsumerPurchases({
      consumerId, ...opts
    }) {
      return this._makeRequest({
        path: `/consumer/${consumerId}/purchases`,
        ...opts,
      });
    },
    getDraftReturnOrders({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/account/${accountId}/draft-return-orders`,
        ...opts,
      });
    },
    getReturnOrders({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/account/${accountId}/return-orders`,
        ...opts,
      });
    },
    getReturnOrderEmails({
      accountId, returnOrderId, ...opts
    }) {
      return this._makeRequest({
        path: `/account/${accountId}/return-order/${returnOrderId}/emails`,
        ...opts,
      });
    },
    getReturnOrder({
      accountId, returnOrderId, ...opts
    }) {
      return this._makeRequest({
        path: `/account/${accountId}/return-order/${returnOrderId}`,
        ...opts,
      });
    },
    getReturnLocations({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/account/${accountId}/return-locations`,
        ...opts,
      });
    },
    createReturnLocation({
      accountId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/account/${accountId}/return-location`,
        ...opts,
      });
    },
    updateReturnLocation({
      accountId, returnLocationId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/account/${accountId}/return-location/${returnLocationId}`,
        ...opts,
      });
    },
    getReturnReasons(opts = {}) {
      return this._makeRequest({
        path: "/return-reasons",
        ...opts,
      });
    },
    getReturnRequests({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/account/${accountId}/return-requests`,
        ...opts,
      });
    },
    getReturnRequest({
      accountId, returnRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/account/${accountId}/return-request/${returnRequestId}`,
        ...opts,
      });
    },
    createWebhook({
      accountId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/account/${accountId}/webhook-subscription`,
        ...opts,
      });
    },
    deleteWebhook({
      accountId, webhookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/account/${accountId}/webhook-subscription/${webhookId}`,
      });
    },
  },
};
