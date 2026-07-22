import { axios } from "@pipedream/platform";
import {
  ACCEPT_HEADER,
  BASE_URL,
  CONTENT_TYPE_HEADER,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "mode",
  propDefinitions: {
    reportToken: {
      type: "string",
      label: "Report Token",
      description: "The token of the report. Run the **List Reports** action to find available report tokens.",
    },
    spaceToken: {
      type: "string",
      label: "Space Token",
      description: "The token of the space (called a Collection in the Mode UI). Run the **List Spaces** action to find available space tokens.",
    },
    queryToken: {
      type: "string",
      label: "Query Token",
      description: "The token of the query within a report. Run the **List Queries** action to find available query tokens.",
    },
    dataSourceId: {
      type: "integer",
      label: "Data Source ID",
      description: "The integer `id` of the data source (NOT the string token). Run the **List Data Sources** action to find available data source ids.",
    },
  },
  methods: {
    _baseUrl() {
      return `${BASE_URL}/${this.$auth.workspace}`;
    },
    _makeRequest({
      $ = this,
      path,
      method = "GET",
      data,
      params,
      headers,
      ...args
    } = {}) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Content-Type": CONTENT_TYPE_HEADER,
          "Accept": ACCEPT_HEADER,
          ...headers,
        },
        auth: {
          username: this.$auth.token,
          password: this.$auth.password,
        },
        data,
        params,
        ...args,
      });
    },
    getAccount({ ...args } = {}) {
      return this._makeRequest({
        path: "",
        ...args,
      });
    },
    listSpaces({ ...args } = {}) {
      return this._makeRequest({
        path: "/spaces",
        ...args,
      });
    },
    listReports({
      spaceToken, ...args
    } = {}) {
      return this._makeRequest({
        path: `/spaces/${spaceToken}/reports`,
        ...args,
      });
    },
    getReport({
      reportToken, ...args
    } = {}) {
      return this._makeRequest({
        path: `/reports/${reportToken}`,
        ...args,
      });
    },
    updateReport({
      reportToken, ...args
    } = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `/reports/${reportToken}`,
        ...args,
      });
    },
    deleteReport({
      reportToken, ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/reports/${reportToken}`,
        ...args,
      });
    },
    runReport({
      reportToken, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/reports/${reportToken}/runs`,
        ...args,
      });
    },
    listReportRuns({
      reportToken, ...args
    } = {}) {
      return this._makeRequest({
        path: `/reports/${reportToken}/runs`,
        ...args,
      });
    },
    getReportRun({
      reportToken, runToken, ...args
    } = {}) {
      return this._makeRequest({
        path: `/reports/${reportToken}/runs/${runToken}`,
        ...args,
      });
    },
    listQueries({
      reportToken, ...args
    } = {}) {
      return this._makeRequest({
        path: `/reports/${reportToken}/queries`,
        ...args,
      });
    },
    getQuery({
      reportToken, queryToken, ...args
    } = {}) {
      return this._makeRequest({
        path: `/reports/${reportToken}/queries/${queryToken}`,
        ...args,
      });
    },
    createQuery({
      reportToken, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/reports/${reportToken}/queries`,
        ...args,
      });
    },
    updateQuery({
      reportToken, queryToken, ...args
    } = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `/reports/${reportToken}/queries/${queryToken}`,
        ...args,
      });
    },
    deleteQuery({
      reportToken, queryToken, ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/reports/${reportToken}/queries/${queryToken}`,
        ...args,
      });
    },
    listDataSources({ ...args } = {}) {
      return this._makeRequest({
        path: "/data_sources",
        ...args,
      });
    },
    getDataSource({
      dataSourceToken, ...args
    } = {}) {
      return this._makeRequest({
        path: `/data_sources/${dataSourceToken}`,
        ...args,
      });
    },
  },
};
