import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "megaventory",
  propDefinitions: {
    product: {
      type: "integer",
      label: "Product ID",
      description: "The ID of the product to update. If the product does not exist, it will be created.",
      async options({
        mapper = ({
          ProductID: value, ProductDescription: label,
        }) => ({
          label,
          value,
        }),
      }) {
        const { mvProducts } = await this.listProducts();
        return mvProducts.map(mapper);
      },
    },
    purchaseOrderId: {
      type: "integer",
      label: "Purchase Order ID",
      description: "The ID of the purchase order to update. If the purchase order does not exist, it will be created.",
      async options() {
        const { mvPurchaseOrders } = await this.listPurchaseOrders();
        return mvPurchaseOrders.map(({
          PurchaseOrderId: value, PurchaseOrderNo: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    salesOrderId: {
      type: "integer",
      label: "Sales Order ID",
      description: "The ID of the sales order to update.",
      async options() {
        const { mvSalesOrders } = await this.listSalesOrders();
        return mvSalesOrders.map(({
          SalesOrderId: value, SalesOrderNo: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    supplierClientId: {
      type: "integer",
      label: "Supplier Client ID",
      description: "The ID of the supplier client.",
      async options({ args }) {
        const { mvSupplierClients } = await this.listSupplierClients(args);
        return mvSupplierClients.map(({
          SupplierClientID: value, SupplierClientName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    documentTypeId: {
      type: "integer",
      label: "Document Type ID",
      description: "The ID of the document type.",
      async options({ args }) {
        const { mvDocumentTypes } = await this.listDocumentTypes(args);
        return mvDocumentTypes.map(({
          DocumentTypeID: value, DocumentTypeDescription: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    inventoryLocationId: {
      type: "integer",
      label: "Inventory Location ID",
      description: "The ID of the inventory location.",
      async options() {
        const { mvInventoryLocations } = await this.listInventoryLocations();
        return mvInventoryLocations.map(({
          InventoryLocationID: value, InventoryLocationName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        ...headers,
      };
    },
    getParams(params) {
      return {
        APIKEY: this.$auth.api_key,
        ...params,
      };
    },
    async makeRequest({
      step = this, path, headers, params, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        params: this.getParams(params),
        ...args,
      };

      const response = await axios(step, config);

      // If ErrorCode is zero (0), then the response is successful.
      if (parseInt(response.ResponseStatus?.ErrorCode, 10)) {
        throw new Error(JSON.stringify(response.ResponseStatus, null, 2));
      }

      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    listProducts(args = {}) {
      return this.post({
        path: "/Product/ProductGet",
        ...args,
      });
    },
    listPurchaseOrders(args = {}) {
      return this.post({
        path: "/PurchaseOrder/PurchaseOrderGet",
        ...args,
      });
    },
    listSalesOrders(args = {}) {
      return this.post({
        path: "/SalesOrder/SalesOrderGet",
        ...args,
      });
    },
    listSupplierClients(args = {}) {
      return this.post({
        path: "/SupplierClient/SupplierClientGet",
        ...args,
      });
    },
    listDocumentTypes(args = {}) {
      return this.post({
        path: "/DocumentType/DocumentTypeGet",
        ...args,
      });
    },
    listInventoryLocations(args = {}) {
      return this.post({
        path: "/InventoryLocation/InventoryLocationGet",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
    }) {
      const { [resourceName]: resources = [] } =
        await resourceFn(resourceFnArgs);

      if (!resources?.length) {
        console.log("No resources found");
        return;
      }

      for (const resource of resources) {
        yield resource;
      }
    },
  },
};
