import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tidy",
  propDefinitions: {
    addressId: {
      type: "string",
      label: "Address",
      description: "Identifier of an address",
      async options() {
        const { data } = await this.listAddresses();
        return data?.map(({
          id: value, address: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    jobId: {
      type: "string",
      label: "Job",
      description: "Identifier of a job",
      async options() {
        const { data } = await this.listJobs();
        return data?.map(({ id: value }) => ({
          value,
          label: value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tidy.com/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Accept": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listAddresses(args = {}) {
      return this._makeRequest({
        path: "/addresses",
        ...args,
      });
    },
    listJobs(args = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...args,
      });
    },
    createAddress(args = {}) {
      return this._makeRequest({
        path: "/addresses",
        method: "POST",
        ...args,
      });
    },
    createJob(args = {}) {
      return this._makeRequest({
        path: "/jobs",
        method: "POST",
        ...args,
      });
    },
    updateJob({
      jobId, ...args
    }) {
      return this._makeRequest({
        path: `/jobs/${jobId}`,
        method: "PUT",
        ...args,
      });
    },
  },
};
