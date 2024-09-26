import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "sellercloud",
  propDefinitions: {
    company: {
      type: "string",
      label: "Company",
      description: "Identifier of a company",
      async options({ page }) {
        const { Items: companies } = await this.listCompanies({
          params: {
            pageNumber: page + 1,
            pageSize: constants.DEFAULT_PAGE_SIZE,
          },
        });
        return companies?.map(({
          ID: id, CompanyName: name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    product: {
      type: "string",
      label: "Product",
      description: "Identifier of a product",
      async options({
        viewID, warehouse, page,
      }) {
        const { Items: products } = await this.listProductsByView({
          params: {
            viewID,
            pageNumber: page + 1,
            pageSize: constants.DEFAULT_PAGE_SIZE,
          },
        });
        return products?.filter(({ WarehouseName: name }) => name === warehouse)?.map(({
          ID: id, ProductName: name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    productType: {
      type: "string",
      label: "Product Type",
      description: "The name of a product type",
      async options({ page }) {
        const { Items: types } = await this.listProductTypes({
          params: {
            pageNumber: page + 1,
            pageSize: constants.DEFAULT_PAGE_SIZE,
          },
        });
        return types?.map(({ ProductTypeName: name }) => name ) || [];
      },
    },
    purchaser: {
      type: "string",
      label: "Purchaser",
      description: "Identifier of the new product's purchaser. Required if client setting ‘Require SiteCost and Buyer/Purchaser while creating product’ is enabled.",
      optional: true,
      async options({ page }) {
        const { Items: customers } = await this.listCustomers({
          params: {
            pageNumber: page + 1,
            pageSize: constants.DEFAULT_PAGE_SIZE,
          },
        });
        return customers?.map(({
          UserID: id, FirstName: first, LastName: last,
        }) => ({
          label: `${first} ${last}`,
          value: id,
        })) || [];
      },
    },
    manufacturer: {
      type: "string",
      label: "Manufacturer",
      description: "Identifier of the new product's manufacturer. Required if client setting ‘Require Manufacturer when creating Product’ is enabled.",
      optional: true,
      async options({
        companyId, page,
      }) {
        const manufacturers = await this.listManufacturers({
          params: {
            companyId,
            pageNumber: page + 1,
            pageSize: constants.DEFAULT_PAGE_SIZE,
          },
        });
        if (!manufacturers?.length) {
          return [];
        }
        return manufacturers.filter((manufacturer) => manufacturer.Key > 0).map((manufacturer) => ({
          label: manufacturer.Value,
          value: manufacturer.Key,
        }));
      },
    },
    orders: {
      type: "string[]",
      label: "Orders",
      description: "Array of order identifiers",
      async options({ page }) {
        const { Items: orders } = await this.listOrders({
          params: {
            pageNumber: page + 1,
            pageSize: constants.DEFAULT_PAGE_SIZE,
          },
        });
        return orders?.map(({ ID: id }) => ({
          label: `Order #${id}`,
          value: id,
        })) || [];
      },
    },
    view: {
      type: "string",
      label: "Catalog View",
      description: "Identifier of a saved catalog view",
      async options({ page }) {
        const views = await this.listCatalogViews({
          params: {
            pageNumber: page + 1,
            pageSize: constants.DEFAULT_PAGE_SIZE,
          },
        });
        return views?.map(({
          ID: id, Name: name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    warehouse: {
      type: "string",
      label: "Warehouse",
      description: "Identifier of a warehouse",
      withLabel: true,
      async options({ page }) {
        const { Items: warehouses } = await this.listWarehouses({
          params: {
            pageNumber: page + 1,
            pageSize: constants.DEFAULT_PAGE_SIZE,
          },
        });
        return warehouses?.map(({
          ID: id, Name: name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Order status code",
      options: constants.ORDER_STATUS_OPTIONS,
    },
    adjustmentType: {
      type: "string",
      label: "Adjustment Type",
      description: "The type of adjustment",
      options: constants.ADJUSTMENT_TYPE_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/rest/api`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this._makeRequest({
        path: "/companies",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        path: "/Customers",
        ...args,
      });
    },
    listManufacturers(args = {}) {
      return this._makeRequest({
        path: "/Settings/Manufacturers",
        ...args,
      });
    },
    listProductTypes(args = {}) {
      return this._makeRequest({
        path: "/Catalog/ProductTypes",
        ...args,
      });
    },
    listOrders(args = {}) {
      return this._makeRequest({
        path: "/orders",
        ...args,
      });
    },
    listCatalogViews(args = {}) {
      return this._makeRequest({
        path: "/Catalog/Views",
        ...args,
      });
    },
    listProductsByView(args = {}) {
      return this._makeRequest({
        path: "/Catalog/GetAllByView",
        ...args,
      });
    },
    listWarehouses(args = {}) {
      return this._makeRequest({
        path: "/Warehouses",
        ...args,
      });
    },
    createProduct(args = {}) {
      return this._makeRequest({
        path: "/Products",
        method: "POST",
        ...args,
      });
    },
    adjustInventory(args = {}) {
      return this._makeRequest({
        path: "/Inventory/AdjustPhysicalInventory",
        method: "PUT",
        ...args,
      });
    },
    updateOrderStatus(args = {}) {
      return this._makeRequest({
        path: "/Orders/StatusCode",
        method: "PUT",
        ...args,
      });
    },
  },
};
