import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ragic",
  propDefinitions: {
    sheet: {
      type: "string",
      label: "Sheet",
      description: "Sheet name",
      async options() {
        const sheets = await this.listSheets();
        return sheets.map((sheet) => ({
          label: sheet.name,
          value: sheet.id,
        }));
      },
    },
    category: {
      type: "string",
      label: "Category",
      description: "Category",
      withLabel: true,
      async options({ sheet }) {
        const categories = await this.listCategories({
          sheet,
        });
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
      async options({
        sheet, category,
      }) {
        const {
          label: categoryName,
          value: categoryId,
        } = category;
        const records = await this.listRecords({
          sheet,
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
      return `https://${domain}.ragic.com/${database}`;
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
    async listSheets(opts = {}) {
      const response = await this._makeRequest({
        ...opts,
      });
      const { children: sheets } = response[this.$auth.database];
      return Object.entries(sheets)
        .map(([
          id,
          value,
        ]) => ({
          ...value,
          id,
        }))
        .filter((sheet) => sheet.id !== "Report" && sheet.id !== "/ragic-setup");
    },
    async listCategories({
      sheet, ...opts
    }) {
      const response = await this._makeRequest({
        ...opts,
        path: `${sheet}`,
      });
      const { children: categories } = response[this.$auth.database]["children"][sheet];
      return Object.entries(categories)
        .map(([
          id,
          value,
        ]) => ({
          ...value,
          id,
        }));
    },
    async listRecords({
      sheet, categoryId, ...opts
    }) {
      const records = await this._makeRequest({
        ...opts,
        path: `${sheet}/${categoryId}`,
      });
      return this._toArray(records);
    },
    async getRecord({
      sheet, categoryId, recordId, ...opts
    }) {
      const response = await this._makeRequest({
        ...opts,
        path: `${sheet}/${categoryId}/${recordId}`,
      });
      return response[recordId];
    },
    async createRecord({
      sheet, categoryId, record, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `${sheet}/${categoryId}`,
        data: record,
      });
    },
    async updateRecord({
      sheet, categoryId, recordId, record, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `${sheet}/${categoryId}/${recordId}`,
        data: record,
      });
    },
  },
};
