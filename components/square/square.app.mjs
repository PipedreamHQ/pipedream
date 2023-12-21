import { axios } from "@pipedream/platform";
import { v4 } from "uuid";
import constants from "./common/constants.mjs";

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
      description: "The source of orders and fulfillments for a physical or virtual business",
      async options() {
        const { locations } = await this.listLocations();
        return locations.map((location) => ({
          label: location.name,
          value: location.id,
        }));
      },
    },
    customer: {
      type: "string",
      label: "Customer",
      description: "The ID of the customer",
      async options({ prevContext }) {
        const {
          customers,
          cursor,
        } = await this.listCustomers({
          params: {
            limit: constants.ASYNC_OPTIONS_LIMIT,
            cursor: prevContext?.nextCursor,
          },
        });
        return {
          options: customers?.map((customer) => ({
            label: this._getCustomerLabel(customer),
            value: customer.id,
          })),
          context: {
            nextCursor: cursor,
          },
        };
      },
    },
    order: {
      type: "string",
      label: "Order",
      description: "The ID of the order ",
      async options({
        prevContext, location,
      }) {
        const {
          orders,
          cursor,
        } = await this.listOrders({
          data: {
            limit: constants.ASYNC_OPTIONS_LIMIT,
            cursor: prevContext?.nextCursor,
            location_ids: [
              location,
            ],
          },
        });
        return {
          options: orders?.map((order) => ({
            label: `Order total: ${order.total_money.amount / 100} ${order.total_money.currency}`,
            value: order.id,
          })),
          context: {
            nextCursor: cursor,
          },
        };
      },
    },
    invoice: {
      type: "string",
      label: "Invoice",
      description: "The ID of the invoice",
      async options({
        prevContext, location,
      }) {
        const {
          invoices,
          cursor,
        } = await this.listInvoices({
          params: {
            location_id: location,
            limit: constants.ASYNC_OPTIONS_LIMIT,
            cursor: prevContext?.nextCursor,
          },
        });

        return {
          options: invoices?.map((invoice) => ({
            label: `${invoice.invoice_number} - order: ${invoice.order_id}`,
            value: invoice.id,
          })),
          context: {
            nextCursor: cursor,
          },
        };
      },
    },
    referenceId: {
      type: "string",
      label: "Reference ID",
      description: "An optional second ID used to associate the customer profile with an entity in another system",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://connect.squareup.com/v2";
    },
    _auth() {
      return this.$auth.oauth_access_token;
    },
    _getCustomerLabel(customer) {
      const name = `${customer.given_name || ""} ${customer.family_name || ""}`.trim();
      const email = customer.email_address;
      const company = customer.company_name;
      const phone = customer.phone_number;
      return name || email || company || phone;
    },
    async _makeRequest({
      $ = this, path, generateIdempotencyKey = false, ...opts
    }) {
      if (generateIdempotencyKey) {
        opts.data = {
          ...opts.data,
          idempotency_key: v4(),
        };
      }
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: {
          ...opts.headers,
          "Authorization": "Bearer " + this._auth(),
          "Accept": "application/json",
          "Square-Version": "2023-12-13",
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
    async createCustomer(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        method: "post",
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
    async getInvoice({
      invoice, ...opts
    }) {
      return this._makeRequest({
        path: `/invoices/${invoice}`,
        ...opts,
      });
    },
    async createInvoice(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        method: "post",
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
    async publishInvoice({
      invoice, ...opts
    }) {
      return this._makeRequest({
        path: `/invoices/${invoice}/publish`,
        method: "post",
        ...opts,
      });
    },
    async createOrder(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        method: "post",
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
    async searchInvoices({
      paginate = false, ...opts
    } = {}) {
      if (paginate) {
        return this.paginate({
          fn: this.searchInvoices,
          ...opts,
        });
      }
      return this._makeRequest({
        path: "/invoices/search",
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
