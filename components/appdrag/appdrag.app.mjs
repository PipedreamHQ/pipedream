import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "appdrag",
  propDefinitions: {
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of the table where the row will be updated or inserted.",
      async options() {
        const tables = await this.listTables();
        return tables.map((table) => ({
          label: table.name,
          value: table.id,
        }));
      },
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to monitor for submissions.",
      async options() {
        const forms = await this.listForms();
        return forms.map((form) => ({
          label: form.name,
          value: form.id,
        }));
      },
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order to monitor for status updates or new orders.",
      async options() {
        const orders = await this.listOrders();
        return orders.map((order) => ({
          label: order.name,
          value: order.id,
        }));
      },
    },
    rowId: {
      type: "string",
      label: "Row ID",
      description: "The ID of the row to update in the cloud database table.",
      async options({ tableId }) {
        const rows = await this.listRows({
          tableId,
        });
        return rows.map((row) => ({
          label: row.name,
          value: row.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.appdrag.com/CloudBackend";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listTables() {
      return this._makeRequest({
        path: "/listTables",
      });
    },
    async listForms() {
      return this._makeRequest({
        path: "/listForms",
      });
    },
    async listOrders() {
      return this._makeRequest({
        path: "/listOrders",
      });
    },
    async listRows({ tableId }) {
      return this._makeRequest({
        path: `/listRows/${tableId}`,
      });
    },
    async updateRow({
      tableId, rowId, data,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/updateRow",
        data: {
          tableId,
          rowId,
          ...data,
        },
      });
    },
    async insertRow({
      tableId, data,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/insertRow",
        data: {
          tableId,
          ...data,
        },
      });
    },
    async executeApiFunction({
      functionName, data,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/executeFunction/${functionName}`,
        data,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
