import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ragic",
  propDefinitions: {
    category: {
      type: "string",
      label: "Category",
      description: "Category",
      withLabel: true,
      async options() {
        const categories = await this.listCategories();
        return categories.map((category) => ({
          label: category.name,
          value: category.id,
        }));
      },
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "Record ID",
      async options({ category }) {
        const {
          label: categoryName,
          value: categoryId,
        } = category;
        const records = await this.listRecords({
          categoryId,
        });
        return records.map((record) => this.formatRecordOptions({
          category: categoryName,
          record,
        }));
      },
    },
    record: {
      type: "object",
      label: "Record",
      description: "The record data",
    },
  },
  methods: {
    _toArray(obj) {
      return Object.values(obj);
    },
    formatRecordOptions({
      category, record,
    }) {
      let label;
      switch (category) {
      case "Accounts":
        label = record["Account Name"];
        break;
      case "Contacts":
        label = record["Contact Name"];
        break;
      case "Leads":
        label = record["Full Name"];
        break;
      case "Opportunities":
        label = record["Opportunity Name"];
        break;
      case "Products (CRM)":
        label = record["Product Name"];
        break;
      case "Quotes":
        label = record["Quote Id"];
        break;
      case "Activities":
        label = record["Subject"];
        break;
      case "Contracts":
        label = `${record["Account"]} - ${record["Contract Owner"]}`;
        break;
      case "Pricelist":
        label = `${record["Product Name"]} - ${record["Price"]}`;
        break;
      }
      return {
        label,
        value: record._ragicId,
      };
    },
    _accessToken() {
      return this.$auth.api_key;
    },
    _defaultParams() {
      return {
        v: this._version(),
        api: "",
      };
    },
    _version() {
      return "3";
    },
    _baseUrl() {
      const {
        domain,
        database,
      } = this.$auth;
      return `https://${domain}.ragic.com/${database}/ragicsales`;
    },
    async _makeRequest({
      $ = this, path = "/", ...opts
    }) {
      const response = await axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Basic ${this._accessToken()}`,
        },
        params: {
          ...this._defaultParams(),
          ...opts.params,
        },
      });
      if (response.status === "ERROR") {
        throw new Error(`${response.status} - ${response.code} - ${response.msg}`);
      }
      return response;
    },
    async listCategories(opts = {}) {
      const response = await this._makeRequest({
        ...opts,
      });
      const { children: { "/ragicsales": { children: categories } } } = response[this.$auth.database];
      return Object.entries(categories).map(([
        id,
        value,
      ]) => ({
        ...value,
        id,
      }));
    },
    async listRecords({
      categoryId, ...opts
    }) {
      const records = await this._makeRequest({
        ...opts,
        path: `/${categoryId}`,
      });
      return this._toArray(records);
    },
    async getRecord({
      categoryId, recordId, ...opts
    }) {
      const response = await this._makeRequest({
        ...opts,
        path: `/${categoryId}/${recordId}`,
      });
      return response[recordId];
    },
    async createRecord({
      categoryId, record, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/${categoryId}`,
        data: record,
      });
    },
    async updateRecord({
      categoryId, recordId, record, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/${categoryId}/${recordId}`,
        data: record,
      });
    },
  },
};
