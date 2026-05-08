import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "veremark",
  propDefinitions: {
    requestGuid: {
      type: "string",
      label: "Request GUID",
      description: "The unique GUID of the background check request. Returned when a request is created via **Create Background Check Request**.",
    },
    criteriaGuid: {
      type: "string",
      label: "Criteria GUID",
      description: "The GUID of the background check criteria/package to use. Use **List Criteria** to discover available options and their GUIDs.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.veremark.com/external/v1";
    },
    _headers() {
      return {
        "Authorization": `Token ${this.$auth.auth_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      method = "GET",
      path,
      data,
      responseType,
      ...opts
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        data,
        responseType,
        ...opts,
      });
    },
    listCriteria(args = {}) {
      return this._makeRequest({
        path: "/criteria/",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/user/",
        ...args,
      });
    },
    listRequests(args = {}) {
      return this._makeRequest({
        path: "/request/",
        ...args,
      });
    },
    getRequest({
      requestGuid, ...args
    } = {}) {
      return this._makeRequest({
        path: `/request/${requestGuid}/`,
        ...args,
      });
    },
    createRequest({
      data, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/request/",
        data,
        ...args,
      });
    },
    downloadReport({
      requestGuid, ...args
    } = {}) {
      return this._makeRequest({
        path: `/request/${requestGuid}/report/`,
        responseType: "arraybuffer",
        ...args,
      });
    },
    downloadDocument({
      documentGuid, ...args
    } = {}) {
      return this._makeRequest({
        path: `/document/${documentGuid}/`,
        responseType: "arraybuffer",
        ...args,
      });
    },
  },
};
