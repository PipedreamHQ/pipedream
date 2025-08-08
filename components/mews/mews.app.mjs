import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mews",
  propDefinitions: {
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Raw payload fields to include in the request (e.g. filters).",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Maximum number of items to return (pagination)",
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Pagination cursor identifying the item one newer than items to return",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.mews.com/api/connector/v1${path}`;
    },
    getAuthData(data) {
      const {
        ClientToken: clientToken,
        AccessToken: accessToken,
        Client: client,
      } = this.$auth;
      return {
        ...data,
        ClientToken: clientToken,
        AccessToken: accessToken,
        Client: client,
      };
    },
    _makeRequest({
      $ = this, path, data, ...args
    } = {}) {
      return axios($, {
        method: "POST",
        url: this.getUrl(path),
        data: this.getAuthData(data),
        ...args,
      });
    },
    reservationsGetAll(args = {}) {
      return this._makeRequest({
        path: "/reservations/getAll/2023-06-06",
        ...args,
      });
    },
    reservationsCreate(args = {}) {
      return this._makeRequest({
        path: "/reservations/create",
        ...args,
      });
    },
    reservationsUpdate(args = {}) {
      return this._makeRequest({
        path: "/reservations/update",
        ...args,
      });
    },
    reservationsCancel(args = {}) {
      return this._makeRequest({
        path: "/reservations/cancel",
        ...args,
      });
    },
    orderItemsGetAll(args = {}) {
      return this._makeRequest({
        path: "/orderItems/getAll",
        ...args,
      });
    },
    productsGetAll(args = {}) {
      return this._makeRequest({
        path: "/products/getAll",
        ...args,
      });
    },
    customersGetAll(args = {}) {
      return this._makeRequest({
        path: "/customers/getAll",
        ...args,
      });
    },
    productServiceOrdersGetAll(args = {}) {
      return this._makeRequest({
        path: "/productServiceOrders/getAll",
        ...args,
      });
    },
    async paginate({
      requester,
      requesterArgs = {},
      resultKey,
      count = 100,
      maxRequests = 3,
    } = {}) {
      const items = [];
      let next;
      let requestCount = 0;

      while (true) {
        if (requestCount >= maxRequests) {
          break;
        }

        const response = await requester({
          ...requesterArgs,
          data: {
            ...requesterArgs?.data,
            Limitation: {
              Cursor: next,
              Count: count,
            },
          },
        });

        items.push(...(response?.[resultKey] || []));

        next = response?.Limitation?.Cursor ?? null;
        requestCount += 1;

        if (!next) {
          break;
        }
      }

      return items;
    },
  },
};
