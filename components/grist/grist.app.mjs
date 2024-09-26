import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "grist",
  propDefinitions: {
    docId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the Grist document to operate on. You can find this in the **Settings** menu of the document.",
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of the table to operate on.",
      async options({ docId }) {
        const { tables } = await this.listTables({
          docId,
        });
        return tables.map(({ id: value }) => value);
      },
    },
    noParse: {
      type: "boolean",
      label: "Do Not Parse",
      description: "Set to `true` to prohibit parsing strings according to the column type.",
      optional: true,
    },
    records: {
      type: "string[]",
      label: "Data Records",
      description: "The data for the records to append or update. Each record should be a JSON-formatted string, mapping column names to [cell values](https://support.getgrist.com/code/modules/GristData/#cellvalue). Eg. `[ { \"fields\": { \"pet\": \"cat\", \"popularity\": 67 } } ]`.",
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listTables({
      docId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/docs/${docId}/tables`,
        ...args,
      });
    },
    addRecords({
      docId, tableId, ...args
    } = {}) {
      return this.post({
        path: `/docs/${docId}/tables/${tableId}/records`,
        ...args,
      });
    },
  },
};
