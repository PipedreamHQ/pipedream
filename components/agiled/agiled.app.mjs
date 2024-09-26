import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "agiled",
  propDefinitions: {
    designationId: {
      type: "integer",
      label: "Designation ID",
      description: "The designation or title of the employee.",
      async options() {
        const { data } = await this.listDesignations();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    departmentId: {
      type: "integer",
      label: "Department ID",
      description: "The department the employee is part of.",
      optional: true,
      async options() {
        const { data } = await this.listDepartments();
        return data.map(({
          id: value, team_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    currencyId: {
      type: "integer",
      label: "Currency ID",
      description: "The currency to use for the invoice.",
      async options() {
        const { data } = await this.listCurrencies();
        return data.map(({
          id: value, currency_code: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "The ID of the user.",
      async options() {
        const { data } = await this.listUsers();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Brand": this.$auth.brand,
        "X-CSRF-TOKEN": " ",
        ...headers,
      };
    },
    getParams(params) {
      return {
        ...params,
        api_token: this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this, path, headers, params, ...args
    } = {}) {
      const {
        getUrl,
        getHeaders,
        getParams,
      } = this;

      const config = {
        ...args,
        url: getUrl(path),
        params: getParams(params),
        headers: getHeaders(headers),
      };

      const response = await axios($, config);

      if (response?.status === "fail") {
        throw new Error(JSON.stringify(response, null, 2));
      }

      return response;
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listDocuments(args = {}) {
      return this._makeRequest({
        path: "/docs",
        ...args,
      });
    },
    listEstimates(args = {}) {
      return this._makeRequest({
        path: "/estimates",
        ...args,
      });
    },
    listInvoices(args = {}) {
      return this._makeRequest({
        path: "/invoices",
        ...args,
      });
    },
    listCurrencies(args = {}) {
      return this._makeRequest({
        path: "/currencies",
        ...args,
      });
    },
    listDesignations(args = {}) {
      return this._makeRequest({
        path: "/designations",
        ...args,
      });
    },
    listDepartments(args = {}) {
      return this._makeRequest({
        path: "/departments",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
  },
};
