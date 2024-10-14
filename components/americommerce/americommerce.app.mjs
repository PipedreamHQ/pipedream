import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "americommerce",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer. This ID is optional.",
      async options({ filter = () => true }) {
        const { customers } = await this.getCustomers();
        return customers
          .filter(filter)
          .map(({
            first_name: firstName, last_name: lastName, id: value,
          }) => ({
            label: [
              firstName,
              lastName,
            ].filter(Boolean).join(" "),
            value,
          }));
      },
    },
    adcodeId: {
      type: "string",
      label: "Adcode ID",
      description: "The adcode ID for the customer.",
      optional: true,
      async options() {
        const { adcodes } = await this.getAdCodes();
        return adcodes.map(({
          name: label, id: value,
        }) => ({
          label,
          value: String(value),
        }));
      },
    },
    customerTypeId: {
      type: "string",
      label: "Customer Type ID",
      description: "The customer type ID for the customer.",
      optional: true,
      async options() {
        const { customer_types: customerTypes } = await this.getCustomerTypes();
        return customerTypes.map(({
          name: label, id: value,
        }) => ({
          label,
          value: String(value),
        }));
      },
    },
    storeId: {
      type: "string",
      label: "Store ID",
      description: "The ID of the store.",
      optional: true,
      async options() {
        const { stores } = await this.getStores();
        return stores.map(({
          name: label, id: value,
        }) => ({
          label,
          value: String(value),
        }));
      },
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The unique identifier for the order. Required for updating or changing the status of an order.",
      optional: true,
      async options() {
        const { orders } = await this.getOrders();
        return orders.map(({
          id, order_number: orderNumber,
        }) => ({
          label: `Order #${orderNumber}`,
          value: String(id),
        }));
      },
    },
    orderStatusId: {
      type: "string",
      label: "Order Status ID",
      description: "The ID of the order status.",
      optional: true,
      async options() {
        const { order_statuses: orderStatuses } = await this.getOrderStatuses();
        return orderStatuses.map(({
          name: label, id: value,
        }) => ({
          label,
          value: String(value),
        }));
      },
    },
    orderAddressId: {
      type: "string",
      label: "Order Address ID",
      description: "The ID of the order's address.",
      optional: true,
      async options() {
        const { addresses } = await this.getOrderAddresses();
        return addresses.map(({
          id, address_line_1: label,
        }) => ({
          label,
          value: String(id),
        }));
      },
    },
    shippingMethodId: {
      type: "string",
      label: "Shipping Method ID",
      description: "The ID of the shipping method.",
      optional: true,
      async options({ mapper = ({ id }) => String(id) }) {
        const { shipments } = await this.getOrderShipments();
        return shipments.map(mapper);
      },
    },
    subscriptionId: {
      type: "string",
      label: "Subscription ID",
      description: "The ID of the subscription.",
      optional: true,
      async options() {
        const { subscriptions } = await this.getSubscriptions();
        return subscriptions.map(({ id }) => String(id));
      },
    },
    emailTemplateId: {
      type: "string",
      label: "Email Template ID",
      description: "The ID of the email template.",
      optional: true,
      async options() {
        const { email_templates: emailTemplates } = await this.getEmailTemplates();
        return emailTemplates.map(({
          type: label, id: value,
        }) => ({
          label,
          value: String(value),
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      const baseUrl = constants.BASE_URL
        .replace(constants.SUBDOMAIN_PLACEHOLDER, this.$auth.subdomain);
      return `${baseUrl}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "X-AC-Auth-Token": this.$auth.api_token,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
      });
    },
    put(args = {}) {
      return this._makeRequest({
        ...args,
        method: "PUT",
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        ...args,
        method: "DELETE",
      });
    },
    getCustomers(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/customers",
      });
    },
    getAdCodes(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/adcodes",
      });
    },
    getCustomerTypes(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/customer_types",
      });
    },
    getStores(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/stores",
      });
    },
    getOrders(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/orders",
      });
    },
    getOrderStatuses(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/order_statuses",
      });
    },
    getOrderAddresses(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/order_addresses",
      });
    },
    getOrderShipments(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/order_shipments",
      });
    },
    getSubscriptions(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/subscriptions",
      });
    },
    getEmailTemplates(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/email_templates",
      });
    },
  },
};
