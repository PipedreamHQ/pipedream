import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "picqer",
  propDefinitions: {
    warehouseId: {
      type: "string",
      label: "Warehouse ID",
      description: "The ID of the warehouse to filter events or update stock levels.",
      async options() {
        const warehouses = await this.listWarehouses();
        return warehouses.map((warehouse) => ({
          label: warehouse.name,
          value: warehouse.idwarehouse,
        }));
      },
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status to filter pick lists.",
      async options() {
        return [
          {
            label: "Open",
            value: "open",
          },
          {
            label: "Closed",
            value: "closed",
          },
        ];
      },
      optional: true,
    },
    carrier: {
      type: "string",
      label: "Carrier",
      description: "The name of the carrier to filter shipments.",
      optional: true,
    },
    shipmentId: {
      type: "string",
      label: "Shipment ID",
      description: "The ID of the shipment to retrieve data or status.",
    },
    returnId: {
      type: "string",
      label: "Return ID",
      description: "The ID of the return receipt to check or retrieve data.",
    },
    customerDetails: {
      type: "object",
      label: "Customer Details",
      description: "The customer details for creating a new order.",
    },
    products: {
      type: "string[]",
      label: "Products",
      description: "A list of products for the order or stock update.",
    },
    productCode: {
      type: "string",
      label: "Product Code",
      description: "The code of the product.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://example.picqer.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Picqer-Api-Key": this.$auth.api_key,
          "Content-Type": "application/json",
        },
      });
    },
    async listWarehouses(opts = {}) {
      return this._makeRequest({
        path: "/warehouses",
        ...opts,
      });
    },
    async createOrder(data = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/orders",
        data: {
          ...data,
        },
      });
    },
    async updateProductStock(data = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/products/${data.productCode}/warehouses/${data.warehouseId}`,
        data: {
          stock: data.stock,
        },
      });
    },
    async getShipmentStatus(opts = {}) {
      return this._makeRequest({
        path: `/shipments/${opts.shipmentId}`,
        ...opts,
      });
    },
    async getShipmentData(opts = {}) {
      return this._makeRequest({
        path: `/shipments/${opts.shipmentId}`,
        ...opts,
      });
    },
    async checkReturnReceipt(opts = {}) {
      return this._makeRequest({
        path: `/returns/${opts.returnId}`,
        ...opts,
      });
    },
    async getReturnReceiptData(opts = {}) {
      return this._makeRequest({
        path: `/returns/${opts.returnId}`,
        ...opts,
      });
    },
  },
};
