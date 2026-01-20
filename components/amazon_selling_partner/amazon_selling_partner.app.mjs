import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "amazon_selling_partner",
  propDefinitions: {
    marketplaceId: {
      type: "string",
      label: "Marketplace ID",
      description: "The Amazon Marketplace ID",
      async options() {
        const { payload } = await this.listMarketplaces();
        return payload?.map(({ marketplace }) => ({
          label: marketplace.name,
          value: marketplace.id,
        })) || [];
      },
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of an order",
      async options({
        marketplaceId, prevContext,
      }) {
        const { payload } = await this.listOrders({
          params: {
            MarketplaceIds: marketplaceId,
            NextToken: prevContext?.next,
            LastUpdatedAfter: new Date(new Date().setMonth(new Date().getMonth() - 1))
              .toISOString(), // 1 month ago
          },
        });
        const {
          Orders: orders, NextToken: next,
        } = payload;
        return {
          options: orders?.map(({ AmazonOrderId }) => ({
            label: AmazonOrderId,
            value: AmazonOrderId,
          })) || [],
          context: {
            next,
          },
        };
      },
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter inbound shipments by status",
      options: [
        "WORKING",
        "SHIPPED",
        "RECEIVING",
        "CANCELLED",
        "DELETED",
        "CLOSED",
        "ERROR",
        "IN_TRANSIT",
        "DELIVERED",
        "CHECKED_IN",
      ],
    },
  },
  methods: {
    _getApiEndpoint(sellerCentralUrl) {
      const na = "https://sellingpartnerapi-na.amazon.com";
      const eu = "https://sellingpartnerapi-eu.amazon.com";
      const fe = "https://sellingpartnerapi-fe.amazon.com";

      const map = {
        // North America
        "https://sellercentral.amazon.com": na,
        "https://sellercentral.amazon.ca": na,
        "https://sellercentral.amazon.com.mx": na,
        "https://sellercentral.amazon.com.br": na,

        // Europe (The Big 5 often share one URL, but newer ones have specific URLs)
        "https://sellercentral-europe.amazon.com": eu,
        "https://sellercentral.amazon.com.be": eu,
        "https://sellercentral.amazon.nl": eu,
        "https://sellercentral.amazon.pl": eu,
        "https://sellercentral.amazon.se": eu,
        "https://sellercentral.amazon.com.tr": eu,

        // India (Uses EU endpoint)
        "https://sellercentral.amazon.in": eu,

        // Far East
        "https://sellercentral.amazon.sg": fe,
        "https://sellercentral.amazon.com.au": fe,
        "https://sellercentral.amazon.co.jp": fe,
      };

      return map[sellerCentralUrl];
    },
    _baseUrl() {
      return this._getApiEndpoint(this.$auth.marketplace);
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-amz-access-token": this.$auth.oauth_access_token,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        ...opts,
      });
    },
    getOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}`,
        ...opts,
      });
    },
    getOrderMetrics(opts = {}) {
      return this._makeRequest({
        path: "/sales/v1/orderMetrics",
        ...opts,
      });
    },
    getInventorySummaries(opts = {}) {
      return this._makeRequest({
        path: "/fba/inventory/v1/summaries",
        ...opts,
      });
    },
    listMarketplaces(opts = {}) {
      return this._makeRequest({
        path: "/sellers/v1/marketplaceParticipations",
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders/v0/orders",
        ...opts,
      });
    },
    listInboundShipments(opts = {}) {
      return this._makeRequest({
        path: "/fba/inbound/v0/shipments",
        ...opts,
      });
    },
    listReports(opts = {}) {
      return this._makeRequest({
        path: "/reports/2021-06-30/reports",
        ...opts,
      });
    },
    listProductPricing(opts = {}) {
      return this._makeRequest({
        path: "/products/pricing/v0/competitivePrice",
        ...opts,
      });
    },
    async *paginate({
      fn, params, resourceKey, hasPayload = true, max,
    }) {
      let hasMore, count = 0;
      do {
        const response = await fn({
          params,
        });
        const payload = hasPayload
          ? response.payload
          : response;
        const items = payload[resourceKey] || [];
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = false;
        if (payload?.NextToken) {
          params.NextToken = payload.NextToken;
          hasMore = true;
        }
        if (payload?.nextToken) {
          params.nextToken = payload.nextToken;
          hasMore = true;
        }
      } while (hasMore);
    },
    async getPaginatedResources(opts = {}) {
      const results = [];
      for await (const item of this.paginate(opts)) {
        results.push(item);
      }
      return results;
    },
    async rotateClientSecret(opts = {}) {
      return this._makeRequest({
        path: "/applications/2023-11-30/clientSecret",
        method: "POST",
        ...opts,
      });
    },
  },
};
