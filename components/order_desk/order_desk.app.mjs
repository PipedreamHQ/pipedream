import { axios } from "@pipedream/platform";
import options from "./common/options.mjs";

export default {
  type: "app",
  app: "order_desk",
  propDefinitions: {
    order_items: {
      type: "string[]",
      label: "Order Items",
      description: "A valid JSON string. Order Items Object can have the following properties: `id, name, price, quantity, weight, code, delivery_type, category_code, variation_list, metadata`. Please check the [documentation](https://apidocs.orderdesk.com/#create-an-order) in the description for more information.",
    },
    customer_first_name: {
      type: "string",
      label: "Customer First Name",
      description: "Customer first name",
      optional: true,
    },
    customer_last_name: {
      type: "string",
      label: "Customer Last Name",
      description: "Customer last name",
      optional: true,
    },
    customer_company: {
      type: "string",
      label: "Customer Company",
      description: "Customer company",
      optional: true,
    },
    shipping_first_name: {
      type: "string",
      label: "Shipping First Name",
      description: "Shipping first name",
      optional: true,
    },
    shipping_last_name: {
      type: "string",
      label: "Shipping Last Name",
      description: "Shipping last name",
      optional: true,
    },
    shipping_company: {
      type: "string",
      label: "Shipping Company",
      description: "Shipping company",
      optional: true,
    },
    order_id: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order to retrieve.",
      async options({ page }) {
        const res = await this.listOrders(page);
        return res.orders.map((order) => ({
          label: `Order ID: ${order.id}`,
          value: order.id,
        }));
      },
    },
    source_id: {
      type: "string",
      label: "Source ID",
      description: "Your order ID. If blank, Order Desk's internal ID will be used read-only.",
      optional: true,
    },
    source_name: {
      type: "string",
      label: "Source Name",
      description: "Pick from Available [Source Names](https://apidocs.orderdesk.com/#available-source-names). Defaults to `Order Desk`.",
      options: options.sourceNameProps,
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Customer email address",
      optional: true,
    },
    shipping_method: {
      type: "string",
      label: "Shipping Method",
      description: "Name of shipping method selected.",
      optional: true,
    },
    quantity_total: {
      type: "string",
      label: "Quantity Total",
      description: "Total number of items in the order.",
      optional: true,
    },
    weight_total: {
      type: "string",
      label: "Weight Total",
      description: "Total weight of the order.",
      optional: true,
    },
    product_total: {
      type: "string",
      label: "Product Total",
      description: "Total cost of all items in the order.",
      optional: true,
    },
    shipping_total: {
      type: "string",
      label: "Shipping Total",
      description: "Total cost of shipping.",
      optional: true,
    },
    handling_total: {
      type: "string",
      label: "Handling Total",
      description: "Total cost of handling.",
      optional: true,
    },
    tax_total: {
      type: "string",
      label: "Tax Total",
      description: "Total cost of tax.",
      optional: true,
    },
    discount_total: {
      type: "string",
      label: "Discount Total",
      description: "Total cost of discounts.",
      optional: true,
    },
    order_total: {
      type: "string",
      label: "Order Total",
      description: "Total cost of the order.",
      optional: true,
    },
    cc_number: {
      type: "string",
      label: "Credit Card Number",
      description: "Obfuscated credit card number. Enter only the last four digits.",
      optional: true,
    },
    cc_exp: {
      type: "string",
      label: "Credit Card Expiration",
      description: "Credit card expiration date in MM/YYYY format.",
      optional: true,
    },
    processor_response: {
      type: "string",
      label: "Processor Response",
      description: "Gateway transaction ID in format `<gateway_name>: <transaction_id>`",
      optional: true,
    },
    payment_type: {
      type: "string",
      label: "Payment Type",
      description: "Payment type. Can be `Visa`, `Paypal`, `Mastercard`, etc",
      optional: true,
    },
    payment_status: {
      type: "string",
      label: "Payment Status",
      description: "Payment status. Can be `Approved`, `Authorized`, `Captured`, `Fully Refunded`, `Partially Refunded`, `Pending`, `Rejected`, `Voided`",
      options: options.paymentStatus,
      optional: true,
    },
    processor_balance: {
      type: "string",
      label: "Processor Balance",
      description: "The amount that the was charged at the processor. This amount will be decremented when refunds are made. By default it will be set the same as `order_total`",
      optional: true,
    },
    refund_total: {
      type: "string",
      label: "Refund Total",
      description: "The amount that jhas been refunded on the order from within Order Desk. This is generally something that will be set internally.",
      optional: true,
    },
    customer_id: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer. This is generally something that will be set internally.",
      optional: true,
    },
    ip_address: {
      type: "string",
      label: "IP Address",
      description: "The IP address of the customer.",
      optional: true,
    },
    fulfillment_name: {
      type: "string",
      label: "Fulfillment Name",
      description: "Once the order has been sent for fulfillment, the name of the fulfillment method is entered here.",
      optional: true,
    },
    fulfillment_id: {
      type: "string",
      label: "Fulfillment ID",
      description: "The internal ID of the fulfillment service will be saved here for some services.",
      optional: true,
    },
    folder_id: {
      type: "string",
      label: "Folder ID",
      description: "The ID number of the folder in which the order is stored. If nothing is entered when adding an order, the folder will be the first folder in the list.",
      optional: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    _getBaseUrl() {
      return "https://app.orderdesk.me/api/v2";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "ORDERDESK-API-KEY": `${this.$auth.api_key}`,
        "ORDERDESK-STORE-ID": `${this.$auth.store_id}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    createOrder(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/orders",
        data,
      });
    },
    updateOrder(data) {
      return this._makeHttpRequest({
        method: "PUT",
        path: `/orders/${data.order_id}`,
        data,
      });
    },
    findOrder(orderId) {
      return this._makeHttpRequest({
        path: `/orders/${orderId}`,
      });
    },
    listOrders(page, params = {}) {
      const PAGE_SIZE = 200;
      return this._makeHttpRequest({
        path: "/orders",
        params: {
          ...params,
          offset: page * PAGE_SIZE,
          limit: PAGE_SIZE,
        },
      });
    },
  },
};
