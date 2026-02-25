import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "bol_com",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of an order",
      async options({ page }) {
        const { orders } = await this.listOrders({
          params: {
            page: page + 1,
          },
        });
        return orders?.map(({ orderId }) => ({
          label: `Order ID: ${orderId}`,
          value: orderId,
        })) || [];
      },
    },
    shipmentId: {
      type: "string",
      label: "Shipment ID",
      description: "The ID of a shipment",
      async options({ page }) {
        const { shipments } = await this.listShipments({
          params: {
            page: page + 1,
          },
        });
        return shipments?.map(({ shipmentId }) => ({
          label: `Shipment ID: ${shipmentId}`,
          value: shipmentId,
        })) || [];
      },
    },
    returnId: {
      type: "string",
      label: "Return ID",
      description: "The ID of a return",
      async options({ page }) {
        const { returns } = await this.listReturns({
          params: {
            page: page + 1,
          },
        });
        return returns?.map(({ returnId }) => ({
          label: `Return ID: ${returnId}`,
          value: returnId,
        })) || [];
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of the category to get the associated products for",
      async options({ page }) {
        const { categories } = await this.listProductCategories({
          params: {
            page: page + 1,
          },
        });
        return categories?.map(({
          categoryId, categoryName,
        }) => ({
          label: categoryName,
          value: categoryId,
        })) || [];
      },
    },
    orderItemId: {
      type: "string",
      label: "Order Item ID",
      description: "The ID of an order item",
      async options({ orderId }) {
        if (!orderId) {
          return [];
        }
        const { orderItems } = await this.getOrder({
          orderId,
        });
        return orderItems?.map(({
          orderItemId, product,
        }) => ({
          label: product.title,
          value: orderItemId,
        })) || [];
      },
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The requested page number with a page size of 50 items",
      default: 1,
      optional: true,
    },
    fulfilmentMethod: {
      type: "string",
      label: "Fulfilment Method",
      description: "Fulfilled by the retailer (FBR) or fulfilled by bol.com (FBB)",
      options: constants.FULFILMENT_METHOD_OPTIONS,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bol.com";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "accept": "application/vnd.retailer.v10+json",
        },
      });
    },
    getOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/retailer/orders/${orderId}`,
        ...opts,
      });
    },
    getShipment({
      shipmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/retailer/shipments/${shipmentId}`,
        ...opts,
      });
    },
    getShippingLabel({
      shippingLabelId, ...opts
    }) {
      return this._makeRequest({
        path: `/retailer/shipping-labels/${shippingLabelId}`,
        ...opts,
      });
    },
    getReturn({
      returnId, ...opts
    }) {
      return this._makeRequest({
        path: `/retailer/returns/${returnId}`,
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/retailer/orders",
        ...opts,
      });
    },
    listShipments(opts = {}) {
      return this._makeRequest({
        path: "/retailer/shipments",
        ...opts,
      });
    },
    listInvoiceRequests(opts = {}) {
      return this._makeRequest({
        path: "/retailer/shipments/invoices/requests",
        ...opts,
      });
    },
    listReturns(opts = {}) {
      return this._makeRequest({
        path: "/retailer/returns",
        ...opts,
      });
    },
    listProductCategories(opts = {}) {
      return this._makeRequest({
        path: "/retailer/products/categories",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/retailer/products/list",
        ...opts,
      });
    },
    createReturn(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/retailer/returns",
        ...opts,
      });
    },
  },
};
