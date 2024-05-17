import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pro_ledger",
  propDefinitions: {
    class: {
      type: "string",
      label: "Class",
      description: "Record's class",
      async options() {
        const resources = await this.getClasses();

        return resources.map(({
          id, label,
        }) => ({
          value: id,
          label: label,
        }));
      },
    },
    category: {
      type: "string",
      label: "category",
      description: "Record's category",
      async options() {
        const resources = await this.getCategories();

        return resources.map(({
          id, label,
        }) => ({
          value: id,
          label: label,
        }));
      },
    },
    account: {
      type: "string",
      label: "Account",
      description: "Reccord's account",
      async options() {
        const resources = await this.getAccounts();

        return resources.map(({
          id, label,
        }) => ({
          value: id,
          label: label,
        }));
      },
    },
    rec: {
      type: "string",
      label: "rec",
      description: "",
      options: constants.RECS,
    },
    taxIncluded: {
      type: "string",
      label: "Tax Included",
      description: "If taxes are already included",
      options: constants.TAX_INCLUDED,
    },
    transactionType: {
      type: "string",
      label: "Transaction Type",
      description: "The transaction type",
      options: constants.TRANSACTION_TYPES,
    },
    source: {
      type: "string",
      label: "source",
      description: "Record's source",
    },
    total: {
      type: "integer",
      label: "Total",
      description: "Record's total",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pro-ledger.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-Key": `${this.$auth.api_key}`,
        },
      });
    },
    async createRecord(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/record/create_new_record",
        ...args,
      });
    },
    async getClasses(args = {}) {
      return this._makeRequest({
        path: "/record/get_classes",
        ...args,
      });
    },
    async getCategories(args = {}) {
      return this._makeRequest({
        path: "/record/get_categories",
        ...args,
      });
    },
    async getAccounts(args = {}) {
      return this._makeRequest({
        path: "/record/get_accounts",
        ...args,
      });
    },
  },
};
