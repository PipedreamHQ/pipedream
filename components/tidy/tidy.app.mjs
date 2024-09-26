import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tidy",
  propDefinitions: {
    addressId: {
      type: "string",
      label: "Address",
      description: "Filter jobs by address",
      optional: true,
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
      description: "Identifier of a job to update",
      async options() {
        const { data } = await this.listJobs();
        return data?.map(({
          id: value, service_type_key: key,
        }) => ({
          value,
          label: `Job ID ${value} - ${key}`,
        })) || [];
      },
    },
    toDoListIds: {
      type: "string[]",
      label: "ToDo List",
      description: "Filter Jobs by todo list(s)",
      optional: true,
      async options({ addressId }) {
        const { data } = await this.listToDoLists({
          params: {
            address_id: addressId,
          },
        });
        return data?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
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
    listToDoLists(args = {}) {
      return this._makeRequest({
        path: "/to-do-lists",
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
