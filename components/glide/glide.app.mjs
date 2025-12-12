import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "glide",
  propDefinitions: {
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of the table",
      async options() {
        const { data } = await this.listTables();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    rowId: {
      type: "string",
      label: "Row ID",
      description: "The ID of the row",
      async options({ tableId }) {
        const { data } = await this.getRows({
          tableId,
        });
        return data.map(({ $rowID }) => $rowID);
      },
    },
  },
  methods: {
    getBaseUrl() {
      return "https://api.glideapps.com";
    },
    getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.secret_token}`,
      };
    },
    makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        headers: this.getHeaders(),
        url: `${this.getBaseUrl()}${path}`,
        ...args,
      });
    },
    listTables(args = {}) {
      return this.makeRequest({
        path: "/tables",
        ...args,
      });
    },
    getRows({
      tableId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/tables/${tableId}/rows`,
        ...args,
      });
    },
    addRows({
      tableId, ...args
    } = {}) {
      return this.makeRequest({
        method: "POST",
        path: `/tables/${tableId}/rows`,
        ...args,
      });
    },
    updateRow({
      tableId, rowId, ...args
    } = {}) {
      return this.makeRequest({
        method: "PATCH",
        path: `/tables/${tableId}/rows/${rowId}`,
        ...args,
      });
    },
    deleteRow({
      tableId, rowId, ...args
    } = {}) {
      return this.makeRequest({
        method: "DELETE",
        path: `/tables/${tableId}/rows/${rowId}`,
        ...args,
      });
    },
  },
};
