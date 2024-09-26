import { axios } from "@pipedream/platform";
import { stringify } from "qs";

export default {
  type: "app",
  app: "cloudtables",
  propDefinitions: {
    datasetID: {
      type: "string",
      label: "Data set",
      description: "The Data Set ID",
      async options() {
        return this.getDataSets(this);
      },
    },
    rowID: {
      type: "integer",
      label: "Row ID",
      description: "Row ID",
    },
  },
  methods: {
    async _makeRequest($, opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      if (!opts.method) opts.method = "get";
      const { path } = opts;
      delete opts.path;
      opts.url = `https://${this.$auth.subdomain}.cloudtables.io/api/1${path[0] === "/"
        ? ""
        : "/"}${path}`;
      opts.params = {
        key: this.$auth.api_key,
      };
      try {
        return await axios($ ?? this, opts);
      } catch (err) {
        this._throwFormattedError(err);
      }
    },
    _throwFormattedError(err) {
      err = err.response.data;
      throw Error(err.error);
    },
    _getHeaders() {
      return {
        "Content-Type": "application/x-www-form-urlencoded",
      };
    },
    async getDataSets($) {
      const dataSetsData = await this._makeRequest($, {
        path: "/datasets",
      });
      return dataSetsData.datasets.map((e) => {
        return {
          value: e.id,
          label: e.name,
        };
      });
    },
    getDataSetSchema(datasetID) {
      return this._makeRequest(this, {
        path: `/dataset/${datasetID}/schema`,
      });
    },
    postRowIntoDataSet(datasetID, data) {
      return this._makeRequest(this, {
        method: "POST",
        path: `/dataset/${datasetID}`,
        headers: this._getHeaders(),
        data: stringify(data),
      });
    },
    putRowInDataSet(datasetID, rowId, data) {
      return this._makeRequest(this, {
        method: "PUT",
        path: `/dataset/${datasetID}/${rowId}`,
        headers: this._getHeaders(),
        data: stringify(data),
      });
    },
    deleteRowFromDataSet(datasetID, rowId) {
      return this._makeRequest(this, {
        method: "DELETE",
        path: `/dataset/${datasetID}/${rowId}`,
        headers: this._getHeaders(),
      });
    },
  },
};
