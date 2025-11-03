import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  type: "app",
  app: "unleashed_software",
  propDefinitions: {
    salesOrderId: {
      type: "string",
      label: "Sales Order ID",
      description: "The ID of a sales order",
      async options({ page }) {
        const { Items: salesOrders } = await this.listSalesOrders({
          page: page + 1,
        });
        return salesOrders?.map(({
          Guid: value, OrderNumber: number,
        }) => ({
          value,
          label: `Sales Order # ${number}`,
        })) || [];
      },
    },
    purchaseOrderId: {
      type: "string",
      label: "Purchase Order ID",
      description: "The ID of a purchase order",
      async options({ page }) {
        const { Items: purchaseOrders } = await this.listPurchaseOrders({
          page: page + 1,
        });
        return purchaseOrders?.map(({
          Guid: value, OrderNumber: number,
        }) => ({
          value,
          label: `Purchase Order # ${number}`,
        })) || [];
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of a customer",
      async options({ page }) {
        const { Items: customers } = await this.listCustomers({
          page: page + 1,
        });
        return customers?.map(({
          Guid: value, CustomerName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    warehouseId: {
      type: "string",
      label: "Warehouse ID",
      description: "The ID of a warehouse",
      async options({ page }) {
        const { Items: warehouses } = await this.listWarehouses({
          page: page + 1,
        });
        return warehouses?.map(({
          Guid: value, WarehouseName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of a product",
      async options({ page }) {
        const { Items: products } = await this.listProducts({
          page: page + 1,
        });
        return products?.map(({
          Guid: value, ProductDescription: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    taxCode: {
      type: "string",
      label: "Tax Code",
      description: "The tax code to use for the order",
      async options({ page }) {
        const { Items: taxes } = await this.listTaxes({
          page: page + 1,
        });
        return taxes?.map(({
          TaxCode: value, Description: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    supplierId: {
      type: "string",
      label: "Supplier ID",
      description: "The ID of a supplier",
      async options({ page }) {
        const { Items: suppliers } = await this.listSuppliers({
          page: page + 1,
        });
        return suppliers?.map(({
          Guid: value, SupplierName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    exchangeRate: {
      type: "string",
      label: "Exchange Rate",
      description: "The exchange rate to use for the order",
    },
    salesOrderStatus: {
      type: "string",
      label: "Order Status",
      description: "The status of the sales order",
      options: [
        "Parked",
        "Placed",
        "Backordered",
        "Completed",
      ],
    },
    purchaseOrderStatus: {
      type: "string",
      label: "Order Status",
      description: "The status of the purchase order",
      options: [
        "Parked",
        "Placed",
        "Complete",
      ],
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "The comments to add to the sales order",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.unleashedsoftware.com";
    },
    _signature(queryString) {
      return crypto
        .createHmac("sha256", this.$auth.api_key)
        .update(queryString)
        .digest("base64");
    },
    _buildQueryString(params) {
      const queryString = new URLSearchParams();
      for (const [
        key,
        value,
      ] of Object.entries(params)) {
        queryString.append(key, value);
      }
      return queryString.toString();
    },
    _makeRequest({
      $ = this, path, params = {}, ...opts
    }) {
      const queryString = this._buildQueryString(params);
      return axios($, {
        url: `${this._baseUrl()}/${path}${queryString
          ? `?${queryString}`
          : ""}`,
        headers: {
          "api-auth-id": this.$auth.api_id,
          "api-auth-signature": this._signature(queryString),
          "Accept": "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        ...opts,
      });
    },
    async getTaxRateFromCode({
      taxCode, ...opts
    }) {
      const { Items: taxes } = await this.listTaxes({
        ...opts,
      });
      return taxes?.find(({ TaxCode: code }) => code === taxCode)?.TaxRate;
    },
    getSalesOrder({
      salesOrderId, ...opts
    }) {
      return this._makeRequest({
        path: `SalesOrders/${salesOrderId}`,
        ...opts,
      });
    },
    getPurchaseOrder({
      purchaseOrderId, ...opts
    }) {
      return this._makeRequest({
        path: `PurchaseOrders/${purchaseOrderId}`,
        ...opts,
      });
    },
    listSalesOrders({
      page = 1, ...opts
    }) {
      return this._makeRequest({
        path: `SalesOrders/${page}`,
        ...opts,
      });
    },
    listPurchaseOrders({
      page = 1, ...opts
    }) {
      return this._makeRequest({
        path: `PurchaseOrders/${page}`,
        ...opts,
      });
    },
    listCustomers({
      page = 1, ...opts
    }) {
      return this._makeRequest({
        path: `Customers/${page}`,
        ...opts,
      });
    },
    listProducts({
      page = 1, ...opts
    }) {
      return this._makeRequest({
        path: `Products/${page}`,
        ...opts,
      });
    },
    listWarehouses({
      page = 1, ...opts
    }) {
      return this._makeRequest({
        path: `Warehouses/${page}`,
        ...opts,
      });
    },
    listTaxes({
      page = 1, ...opts
    }) {
      return this._makeRequest({
        path: `Taxes/${page}`,
        ...opts,
      });
    },
    listSuppliers({
      page = 1, ...opts
    }) {
      return this._makeRequest({
        path: `Suppliers/${page}`,
        ...opts,
      });
    },
    getStockOnHand({
      page = 1, ...opts
    }) {
      return this._makeRequest({
        path: `StockOnHand/${page}`,
        ...opts,
      });
    },
    createSalesOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "SalesOrders",
        ...opts,
      });
    },
    createPurchaseOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "PurchaseOrders",
        ...opts,
      });
    },
    createStockAdjustment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "StockAdjustments",
        ...opts,
      });
    },
    createStockTransfer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "WarehouseStockTransfers",
        ...opts,
      });
    },
    updateSalesOrder({
      salesOrderId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `SalesOrders/${salesOrderId}`,
        ...opts,
      });
    },
    updatePurchaseOrder({
      purchaseOrderId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `PurchaseOrders/${purchaseOrderId}`,
        ...opts,
      });
    },
  },
};
