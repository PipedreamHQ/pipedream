import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "returnless",
  propDefinitions: {
    returnOrderId: {
      type: "string",
      label: "Return Order ID",
      description: "The ID of the return order to update",
      async options({ prevContext }) {
        const {
          data, meta,
        } = await this.listReturnOrders({
          params: {
            cursor: prevContext?.cursor,
          },
        });
        return {
          options: data.map(({
            id: value, return_number: number,
          }) => ({
            value,
            label: `Return Number: ${number}`,
          })) || [],
          context: {
            cursor: meta.next_cursor,
          },
        };
      },
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to use for the return order",
      async options({ prevContext }) {
        const {
          data, meta,
        } = await this.listForms({
          params: {
            cursor: prevContext?.cursor,
          },
        });
        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            cursor: meta.next_cursor,
          },
        };
      },
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of the sales order to use for the return order",
      async options({ prevContext }) {
        const {
          data, meta,
        } = await this.listSalesOrders({
          params: {
            cursor: prevContext?.cursor,
          },
        });
        return {
          options: data.map(({
            id: value, order_number: number,
          }) => ({
            value,
            label: `Order Number: ${number}`,
          })) || [],
          context: {
            cursor: meta.next_cursor,
          },
        };
      },
    },
    countryId: {
      type: "string",
      label: "Country ID",
      description: "The ID of the country to use for the return order",
      async options() {
        const { data } = await this.listCountries();
        return data.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    itemIds: {
      type: "string[]",
      label: "Item IDs",
      description: "The IDs of the items in the sales order to return",
      async options({
        prevContext, orderId,
      }) {
        const {
          data, meta,
        } = await this.listSalesOrderItems({
          orderId,
          params: {
            cursor: prevContext?.cursor,
          },
        });
        return {
          options: data.map(({ id }) => id) || [],
          context: {
            cursor: meta.next_cursor,
          },
        };
      },
    },
    returnStatusId: {
      type: "string",
      label: "Return Status ID",
      description: "The ID of the return status to use for the return order",
      async options({ prevContext }) {
        const {
          data, meta,
        } = await this.listReturnStatuses({
          params: {
            cursor: prevContext?.cursor,
          },
        });
        return {
          options: data.map(({
            id: value, label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            cursor: meta.next_cursor,
          },
        };
      },
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The locale of the form to use for the return order",
      async options({ formId }) {
        const { data } = await this.getForm({
          formId,
        });
        return data.locales.map(({ locale }) => locale);
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
    shipmentId: {
      type: "string",
      label: "Shipment ID",
      description: "The ID of the shipment",
      async options({ prevContext }) {
        const {
          data, meta,
        } = await this.listShipments({
          params: {
            cursor: prevContext?.cursor,
          },
        });
        return {
          options: data.map(({
            id: value, tracking_code: code,
          }) => ({
            value,
            label: code || value,
          })) || [],
          context: {
            cursor: meta.next_cursor,
          },
        };
      },
    },
    returnAddressId: {
      type: "string",
      label: "Return Address ID",
      description: "The ID of the return address",
      async options({ prevContext }) {
        const {
          data, meta,
        } = await this.listReturnAddresses({
          params: {
            cursor: prevContext?.cursor,
          },
        });
        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            value,
            label: label || value,
          })) || [],
          context: {
            cursor: meta.next_cursor,
          },
        };
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer",
      async options({ prevContext }) {
        const {
          data, meta,
        } = await this.listCustomers({
          params: {
            cursor: prevContext?.cursor,
          },
        });
        return {
          options: data.map(({
            id: value, email: label,
          }) => ({
            value,
            label: label || value,
          })) || [],
          context: {
            cursor: meta.next_cursor,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-v2.returnless.com/2025-01";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/webhook-subscriptions",
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        path: `/webhook-subscriptions/${hookId}`,
        method: "DELETE",
        ...opts,
      });
    },
    getOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/sales-orders/${orderId}`,
        ...opts,
      });
    },
    getForm({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/forms/${formId}`,
        ...opts,
      });
    },
    listCountries(opts = {}) {
      return this._makeRequest({
        path: "/countries",
        ...opts,
      });
    },
    listForms(opts = {}) {
      return this._makeRequest({
        path: "/forms",
        ...opts,
      });
    },
    listReturnOrders(opts = {}) {
      return this._makeRequest({
        path: "/return-orders",
        ...opts,
      });
    },
    listSalesOrders(opts = {}) {
      return this._makeRequest({
        path: "/sales-orders",
        ...opts,
      });
    },
    listSalesOrderItems({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/sales-orders/${orderId}/items`,
        ...opts,
      });
    },
    listReturnStatuses(opts = {}) {
      return this._makeRequest({
        path: "/return-statuses",
        ...opts,
      });
    },
    listReturnReasons(opts = {}) {
      return this._makeRequest({
        path: "/return-reasons",
        ...opts,
      });
    },
    getReturnOrder({
      returnOrderId, ...opts
    }) {
      return this._makeRequest({
        path: `/return-orders/${returnOrderId}`,
        ...opts,
      });
    },
    listReturnOrderShipments({
      returnOrderId, ...opts
    }) {
      return this._makeRequest({
        path: `/return-orders/${returnOrderId}/shipments`,
        ...opts,
      });
    },
    getReturnStatus({
      returnStatusId, ...opts
    }) {
      return this._makeRequest({
        path: `/return-statuses/${returnStatusId}`,
        ...opts,
      });
    },
    listShipments(opts = {}) {
      return this._makeRequest({
        path: "/shipments",
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
    listShipmentStatuses({
      shipmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/shipments/${shipmentId}/statuses`,
        ...opts,
      });
    },
    listReturnAddresses(opts = {}) {
      return this._makeRequest({
        path: "/return-addresses",
        ...opts,
      });
    },
    getReturnAddress({
      returnAddressId, ...opts
    }) {
      return this._makeRequest({
        path: `/return-addresses/${returnAddressId}`,
        ...opts,
      });
    },
    updateReturnAddress({
      returnAddressId, ...opts
    }) {
      return this._makeRequest({
        path: `/return-addresses/${returnAddressId}`,
        method: "PATCH",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    getCustomer({
      customerId, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}`,
        ...opts,
      });
    },
    listCustomerReturnOrders({
      customerId, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}/return-orders`,
        ...opts,
      });
    },
    createReturnOrderIntent(opts = {}) {
      return this._makeRequest({
        path: "/return-order-intents",
        method: "POST",
        ...opts,
      });
    },
    createReturnOrder(opts = {}) {
      return this._makeRequest({
        path: "/return-orders",
        method: "POST",
        ...opts,
      });
    },
    updateReturnOrderStatus({
      returnOrderId, ...opts
    }) {
      return this._makeRequest({
        path: `/return-orders/${returnOrderId}/status`,
        method: "PATCH",
        ...opts,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          per_page: 100,
        },
      };
      let cursor, count = 0;
      do {
        const {
          data, meta,
        } = await fn(args);
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        cursor = meta.next_cursor;
        args.params.cursor = cursor;
      } while (cursor);
    },
    async getPaginatedResources(opts) {
      const resources = [];
      for await (const resource of this.paginate(opts)) {
        resources.push(resource);
      }
      return resources;
    },
  },
};
