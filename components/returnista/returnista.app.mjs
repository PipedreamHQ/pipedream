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
      description: "The ID of the Returnista account",
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
      description: "A filter to apply to the results. Supports filtering by purchaseOrderNumber, status, createdAt, updatedAt, store, and other fields. For date filters, use operators: >, <, >=, <= (e.g., `createdAt>2024-05-24T12:05:15.264Z`). For other filters, use colon format (e.g., `purchaseOrderNumber:12345` or `status:draft`)",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "A search string to filter the results. Searches across purchase order numbers, consumer first name, last name, email, and consumer full name. Examples: `search=12345` | `search=john@example.com`",
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
      description: "The ID of the return order. Use **List Return Orders** to find IDs.",
    },
    draftReturnOrderId: {
      type: "string",
      label: "Draft Return Order ID",
      description: "The ID of the draft return order. Use **List Return Orders** with `filter: \"status:draft\"` to find draft order IDs.",
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "Related objects to inline in the response. Select one or more to enrich the result without additional API calls.",
      options: [
        "consumer",
        "shipments",
        "returnRequests",
      ],
      optional: true,
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
      description: "The suffix of the return location address",
      optional: true,
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
      description: "The ISO 3166-1 alpha-2 country code of the return location (e.g., `NL`, `DE`, `GB`, `US`)",
      options: COUNTRY_CODE_OPTIONS,
    },
    stateProvinceCode: {
      type: "string",
      label: "State/Province Code",
      description: "The state or province code of the return location",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name associated with the return location",
    },
    attention: {
      type: "string",
      label: "Attention",
      description: "The attention line for the return location, typically used to direct the return to a specific department or individual",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number associated with the return location (e.g., `+31201234567`)",
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "A contact person's name associated with the return location",
      optional: true,
    },
    returnLocationId: {
      type: "string",
      label: "Return Location ID",
      description: "The ID of the return location. Use **List Return Locations** to find IDs.",
    },
    returnRequestId: {
      type: "string",
      label: "Return Request ID",
      description: "The ID of the return request. Use **List Return Requests** to find IDs.",
    },
    purchaseId: {
      type: "string",
      label: "Purchase ID",
      description: "The ID of the purchase to return. Use **Get Consumer Purchases** to find purchase IDs.",
    },
    returnReasonId: {
      type: "string",
      label: "Return Reason ID",
      description: "The UUID of the return reason. Use **Get Return Reasons** to find available IDs. Leave blank to submit without a reason (sends `null`).",
      optional: true,
    },
    returnReasonComment: {
      type: "string",
      label: "Return Reason Comment",
      description: "An optional free-text comment explaining the return reason.",
      optional: true,
    },
    resolutionType: {
      type: "string",
      label: "Resolution Type",
      description: "The desired resolution type for the return.",
      options: [
        "Refund",
        "Exchange",
        "StoreCredit",
      ],
      optional: true,
    },
    exchangeProductId: {
      type: "string",
      label: "Exchange Product ID",
      description: "The ID of the product to exchange for. Typically required when `resolutionType` is `Exchange`.",
      optional: true,
    },
    exchangeOptionSku: {
      type: "string",
      label: "Exchange Option SKU",
      description: "The SKU of the product variant to exchange for. Typically required when `resolutionType` is `Exchange`.",
      optional: true,
    },
    answers: {
      type: "string[]",
      label: "Answers",
      description: "Array of form field answers for the return questionnaire. Each entry is a stringified JSON object with `formField` and `answer`. "
        + "Example entry: `{\"formField\":{\"id\":\"uuid-here\",\"type\":\"SingleChoice\",\"required\":true},\"answer\":\"value\"}`. "
        + "`answer` can also be an array of strings (MultiChoice) or an array of file objects: `[{\"mimeType\":\"image/jpeg\",\"url\":\"https://...\"}]`.",
      optional: true,
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
    createDraftReturnOrder({
      consumerId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/consumer/${consumerId}/draft-return-order`,
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
    resendConfirmationEmail({
      accountId, returnOrderId, ...opts
    }) {
      return this._makeRequest({
        path: `/account/${accountId}/return-order/${returnOrderId}/resend-confirmation-email`,
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
    processDraftReturnOrder({
      accountId, draftReturnOrderId, action, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/account/${accountId}/draft-return-order/${draftReturnOrderId}/${action}`,
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
