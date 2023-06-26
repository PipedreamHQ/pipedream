import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "sellercloud",
  propDefinitions: {
    company: {
      type: "string",
      label: "Company",
      description: "Identifier of an company",
      async options({ page }) {
        const { Items: companies } = await this.listCompanies({
          params: {
            pageNumber: page + 1,
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
    productType: {
      type: "string",
      label: "Product Type",
      description: "The name of a product type",
      async options({ page }) {
        const { Items: types } = await this.listProductTypes({
          params: {
            pageNumber: page + 1,
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
          },
        });
        return orders?.map(({ ID: id }) => ({
          label: `Order #${id}`,
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
    createProduct(args = {}) {
      return this._makeRequest({
        path: "/Products",
        method: "POST",
        ...args,
      });
    },
    adjustInventory(args = {}) {
      return this._makeRequest({
        path: "/inventories",
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
