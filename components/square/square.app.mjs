import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "square",
  propDefinitions: {
    eventTypes: {
      type: "string[]",
      label: "Webhook Event Types",
      description: "Custom webhook event types. [See docs here](https://developer.squareup.com/docs/webhooks/v2webhook-events-tech-ref).",
      async options() {
        const { event_types } = await this.listWebhookEventTypes();
        return event_types;
      },
    },
    location: {
      type: "string",
      label: "Location",
      description: "",
      async options() {
        const { locations } = await this.listLocations();
        return locations.map((location) => ({
          label: location.name,
          value: location.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://connect.squareup.com/v2";
    },
    _auth() {
      return this.$auth.oauth_access_token;
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: {
          ...opts.headers,
          Authorization: "Bearer " + this._auth(),
          Accept: "application/json",
        },
      });
    },
    async createWebhook({
      eventTypes, name, url,
    }) {
      return this._makeRequest({
        path: "/webhooks/subscriptions",
        method: "post",
        data: {
          subscription: {
            name,
            event_types: eventTypes,
            notification_url: url,
          },
        },
      });
    },
    async deleteWebhook({ id }) {
      return this._makeRequest({
        path: `/webhooks/subscriptions/${id}`,
        method: "delete",
      });
    },
    async listWebhookEventTypes({
      paginate = false, ...opts
    } = {}) {
      if (paginate) {
        return this.paginate({
          fn: this.listWebhookEventTypes,
          ...opts,
        });
      }
      return this._makeRequest({
        path: "/webhooks/event-types",
        ...opts,
      });
    },
    async listCatalogItems({
      paginate = false, ...opts
    } = {}) {
      if (paginate) {
        return this.paginate({
          fn: this.listCatalogItems,
          ...opts,
        });
      }
      return this._makeRequest({
        path: "/catalog/list",
        ...opts,
      });
    },
    async listBookings({
      paginate = false, ...opts
    } = {}) {
      if (paginate) {
        return this.paginate({
          fn: this.listBookings,
          ...opts,
        });
      }
      return this._makeRequest({
        path: "/bookings",
        ...opts,
      });
    },
    async listCustomers({
      paginate = false, ...opts
    } = {}) {
      if (paginate) {
        return this.paginate({
          fn: this.listCustomers,
          ...opts,
        });
      }
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    async listInvoices({
      paginate = false, ...opts
    } = {}) {
      if (paginate) {
        return this.paginate({
          fn: this.listInvoices,
          ...opts,
        });
      }
      return this._makeRequest({
        path: "/invoices",
        ...opts,
      });
    },
    async listOrders({
      paginate = false, ...opts
    } = {}) {
      if (paginate) {
        return this.paginate({
          fn: this.listOrders,
          ...opts,
        });
      }
      return this._makeRequest({
        path: "/orders/search",
        method: "post",
        ...opts,
      });
    },
    async listLocations({
      paginate = false, ...opts
    } = {}) {
      if (paginate) {
        return this.paginate({
          fn: this.listLocations,
          ...opts,
        });
      }
      return this._makeRequest({
        path: "/locations",
        ...opts,
      });
    },
    async paginate({
      fn, ...opts
    }) {
      const objects = [];
      let cursor;

      do {
        const response = await fn.call(this, ({
          ...opts,
          params: {
            ...opts.params,
            cursor,
          },
        }));
        if (response.objects) objects.push(...response.objects);
        cursor = response.cursor;
      } while (cursor);

      return {
        objects,
      };
    },
  },
};
