import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ragic",
  propDefinitions: {
    tab: {
      type: "string",
      label: "Tab",
      description: "Tab name",
      async options() {
        const tabs = await this.listTabs();
        return tabs.map((tab) => ({
          label: tab.name,
          value: tab.id,
        }));
      },
    },
    sheet: {
      type: "string",
      label: "Sheet",
      description: "Sheet",
      withLabel: true,
      async options({ tab }) {
        const sheets = await this.listSheets({
          tab,
        });
        return sheets.map((sheet) => ({
          label: sheet.name,
          value: sheet.id,
        }));
      },
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "Record ID",
      async options({
        tab, sheet,
      }) {
        const {
          label: sheetName,
          value: sheetId,
        } = sheet;
        const records = await this.listRecords({
          tab,
          sheetId,
        });
        return records.map((record) => this.formatRecordOptions({
          sheet: sheetName,
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
      sheet, record,
    }) {
      let label;
      switch (sheet) {
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
    async listTabs(opts = {}) {
      const response = await this._makeRequest({
        ...opts,
      });
      const { children: tabs } = response[this.$auth.database];
      return Object.entries(tabs)
        .map(([
          id,
          value,
        ]) => ({
          ...value,
          id,
        }))
        .filter((tab) => tab.id !== "Report" && tab.id !== "/ragic-setup");
    },
    async listSheets({
      tab, ...opts
    }) {
      const response = await this._makeRequest({
        ...opts,
        path: `${tab}`,
      });
      const { children: sheets } = response[this.$auth.database]["children"][tab];
      return Object.entries(sheets)
        .map(([
          id,
          value,
        ]) => ({
          ...value,
          id,
        }));
    },
    async listRecords({
      tab, sheetId, ...opts
    }) {
      const records = await this._makeRequest({
        ...opts,
        path: `${tab}/${sheetId}`,
      });
      return this._toArray(records);
    },
    async getRecord({
      tab, sheetId, recordId, ...opts
    }) {
      const response = await this._makeRequest({
        ...opts,
        path: `${tab}/${sheetId}/${recordId}`,
      });
      return response[recordId];
    },
    async createRecord({
      tab, sheetId, record, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `${tab}/${sheetId}`,
        data: record,
      });
    },
    async updateRecord({
      tab, sheetId, recordId, record, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `${tab}/${sheetId}/${recordId}`,
        data: record,
      });
    },
  },
};
