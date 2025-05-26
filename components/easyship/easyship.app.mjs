import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "easyship",
  propDefinitions: {
    shipmentId: {
      type: "string",
      label: "Shipment ID",
      description: "The ID of the shipment to find",
      async options({ page }) {
        const { shipments } = await this.listShipments({
          params: {
            page: page + 1,
            per_page: 100,
          },
        });
        return shipments.map((shipment) => shipment.easyship_shipment_id );
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://public-api.easyship.com/2024-09";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
          Accept: "application/json",
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        ...opts,
      });
    },
    activateWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        path: `/webhooks/${webhookId}/activate`,
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        path: `/webhooks/${webhookId}`,
        method: "DELETE",
        ...opts,
      });
    },
    getShipment({
      shipmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/shipments/${shipmentId}`,
        ...opts,
      });
    },
    listCategories(opts = {}) {
      return this._makeRequest({
        path: "/item_categories",
        ...opts,
      });
    },
    listShipments(opts = {}) {
      return this._makeRequest({
        path: "/shipments",
        ...opts,
      });
    },
    createShipment(opts = {}) {
      return this._makeRequest({
        path: "/shipments",
        method: "POST",
        ...opts,
      });
    },
    async *paginate({
      fn, params, resourceKey, max,
    }) {
      params = {
        ...params,
        page: 1,
        per_page: 100,
      };
      let total, count = 0;
      do {
        const response = await fn({
          params,
        });
        const items = response[resourceKey];
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        params.page++;
        total = items.length;
      } while (total === params.per_page);
    },
    async getPaginatedResources(opts = {}) {
      const results = [];
      for await (const item of this.paginate(opts)) {
        results.push(item);
      }
      return results;
    },
  },
};
