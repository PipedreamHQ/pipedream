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
        return records.map((record) => this._formatRecordOptions({
          category: categoryName,
          record,
        }));
      },
    },
  },
  methods: {
    _toArray(obj) {
      return Object.values(obj);
    },
    _formatRecordOptions({
      category, record,
    }) {
      let label, value;
      switch (category) {
      case "Accounts":
        label = record["Account Name"];
        value = record["Account ID"];
        break;
      case "Contacts":
        label = record["Contact Name"];
        value = record["Contact ID"];
        break;
      case "Leads":
        label = record["Full Name"];
        value = record["Lead No."];
        break;
      case "Opportunities":
        label = record["Opportunity Name"];
        value = record["Opportunity No."];
        break;
      case "Products (CRM)":
        label = record["Product Name"];
        value = record["Product No."];
        break;
      case "Quotes":
        label = record["Quote Id"];
        value = record["Quote Id"];
        break;
      case "Activities":
        label = record["Subject"];
        value = record["Task ID"];
        break;
      case "Contracts":
        label = `${record["Account"]} - ${record["Contract Owner"]}`;
        value = record["Contract Number"];
        break;
      case "Pricelist":
        label = `${record["Product Name"]} - ${record["Price"]}`;
        value = record["Product Price No."];
        break;
      }
      return {
        label,
        value,
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
      return axios($, {
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
  },
};
