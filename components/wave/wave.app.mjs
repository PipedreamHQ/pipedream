import { axios } from "@pipedream/platform";
import {
  LIST_BUSINESS_QUERY,
  LIST_CUSTOMERS_BY_BUSINESS_QUERY,
  LIST_INVOICES_BY_BUSINESS_QUERY,
  LIST_PRODUCTS_BY_BUSINESS_QUERY,
} from "./common/queries.mjs";
import {
  CREATE_CUSTOMER_MUTATION,
  CREATE_INVOICE_MUTATION,
} from "./common/mutations.mjs";

export default {
  type: "app",
  app: "wave",
  propDefinitions: {
    businessId: {
      type: "string",
      label: "Business",
      description: "The business.",
      async options({ page }) {
        const res = await this.listBusiness(page + 1);

        return res.data.businesses.edges.map((edge) => {
          const {
            id,
            name,
          } = edge.node;
          return {
            label: name,
            value: id,
          };
        });
      },
    },
    customerId: {
      type: "string",
      label: "Customer",
      description: "The customer.",
      async options({
        page,
        businessId,
      }) {
        const res = await this.listCustomersByBusiness(businessId, page + 1);
        return res.data.business.customers.edges.map((edge) => {
          const {
            id,
            name,
          } = edge.node;
          return {
            label: name,
            value: id,
          };
        });
      },
    },
    productsId: {
      type: "string[]",
      label: "Products",
      description: "The product.",
      async options({
        page,
        businessId,
      }) {
        const res = await this.listProductsByBusiness(businessId, page + 1);
        return res.data.business.products.edges.map((edge) => {
          const {
            id,
            name,
          } = edge.node;
          return {
            label: name,
            value: id,
          };
        });
      },
    },
  },
  methods: {
    _getBaseURL() {
      return "https://gql.waveapps.com/graphql/public";
    },
    _getAuthorizationHeader() {
      return `Bearer ${this.$auth.oauth_access_token}`;
    },
    _getHeaders() {
      return {
        Authorization: this._getAuthorizationHeader(),
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        method: "POST",
        url: this._getBaseURL(),
        headers: {
          ...this._getHeaders(),
          ...opts.headers,
        },
      };

      return axios(ctx, axiosOpts);
    },
    async listBusiness(page) {
      const PAGE_SIZE = 100;
      return this._makeHttpRequest({
        data: {
          query: LIST_BUSINESS_QUERY,
          variables: {
            page,
            pageSize: PAGE_SIZE,
          },
        },
      });
    },
    async listCustomersByBusiness(businessId, page) {
      const PAGE_SIZE = 100;
      return this._makeHttpRequest({
        data: {
          query: LIST_CUSTOMERS_BY_BUSINESS_QUERY,
          variables: {
            businessId,
            page,
            pageSize: PAGE_SIZE,
            sort: [
              "CREATED_AT_DESC",
            ],
          },
        },
      });
    },
    async listProductsByBusiness(businessId, page) {
      const PAGE_SIZE = 100;
      return this._makeHttpRequest({
        data: {
          query: LIST_PRODUCTS_BY_BUSINESS_QUERY,
          variables: {
            businessId,
            page,
            pageSize: PAGE_SIZE,
          },
        },
      });
    },
    async listInvoicesByBusiness(businessId, page) {
      const PAGE_SIZE = 100;
      console.log({
        variables: {
          businessId,
          page,
          pageSize: PAGE_SIZE,
        },
      });
      return this._makeHttpRequest({
        data: {
          query: LIST_INVOICES_BY_BUSINESS_QUERY,
          variables: {
            businessId,
            page,
            pageSize: PAGE_SIZE,
          },
        },
      });
    },
    async createCustomer(input) {
      return this._makeHttpRequest({
        data: {
          query: CREATE_CUSTOMER_MUTATION,
          variables: {
            input,
          },
        },
      });
    },
    async createInvoice(businessId, customerId, itemIds) {
      return this._makeHttpRequest({
        data: {
          query: CREATE_INVOICE_MUTATION,
          variables: {
            input: {
              businessId,
              customerId,
              items: itemIds.map((id) => ({
                productId: id,
              })),
            },
          },
        },
      });
    },
  },
};
