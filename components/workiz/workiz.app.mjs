import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "workiz",
  methods: {
    _baseUrl() {
      return `https://api.workiz.com/api/v1/${this.$auth.api_token}`;
    },
    _authData(data) {
      return {
        ...data,
        auth_secret: `${this.$auth.api_secret}`,
      };
    },
    _headers() {
      return {
        Accept: "application/json",
      };
    },
    _makeRequest({
      $ = this,
      path,
      data,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      if (data) {
        config.data = this._authData(data);
      }
      return axios($, config);
    },
    listJobs(args = {}) {
      return this._makeRequest({
        path: "/job/all/",
        ...args,
      });
    },
    listLeads(args = {}) {
      return this._makeRequest({
        path: "/lead/all/",
        ...args,
      });
    },
    createJob(args = {}) {
      return this._makeRequest({
        path: "/job/create/",
        method: "POST",
        ...args,
      });
    },
    createLead(args = {}) {
      return this._makeRequest({
        path: "/lead/create/",
        method: "POST",
        ...args,
      });
    },
  },
};
