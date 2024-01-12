import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "intellihr",
  propDefinitions: {
    personId: {
      type: "string",
      label: "Person ID",
      description: "The unique identifier for a person in intellihr. Use the search query to search by name.",
      useQuery: true,
      async options({
        page, query,
      }) {
        const params = {
          page: page + 1,
        };
        if (query) {
          params["filters[name][eq]"] = query;
        }
        const { data } = await this.listPeople({
          params,
        });
        return data?.map(({
          id: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    workRightId: {
      type: "string",
      label: "Work Right ID",
      description: "Identifier of the Work Right to whom this Person belongs",
      optional: true,
      async options({ page }) {
        const { data } = await this.listWorkRights({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "Identifier of a Job",
      optional: true,
      async options({ page }) {
        const { data } = await this.listJobs({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the person",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the person",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the person",
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the persion",
      optional: true,
    },
    dateOfBirth: {
      type: "string",
      label: "Date of Birth",
      description: "Date of Birth (YYYY-MM-DD)",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title to refer to this Person as, for example \"Mr\". ",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "Human readable string for the Person's gender, e.g. `Male`.",
      options: constants.GENDER,
      optional: true,
    },
    employeeNumber: {
      type: "string",
      label: "Employee Number",
      description: "A manually entered employee number that identifies a Person in intelliHR. It may be hidden in the system's UI depending upon your tenant's configuration.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.intellihr.io/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "tenant": `${this.$auth.tenant_name}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
      });
    },
    listPeople(opts = {}) {
      return this._makeRequest({
        path: "/people",
        ...opts,
      });
    },
    listWorkRights(opts = {}) {
      return this._makeRequest({
        path: "/work-rights",
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...opts,
      });
    },
    createPerson(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/people",
        ...opts,
      });
    },
    updatePerson({
      personId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/people/${personId}`,
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      params,
      max,
    }) {
      params = {
        ...params,
        limit: constants.DEFAULT_LIMIT,
        page: 1,
      };
      let count = 0;
      let total = 0;
      do {
        const { data } = await resourceFn({
          params,
        });
        for (const item of data) {
          yield item;
          count++;
          if (max && count === max) {
            return;
          }
        }
        total = data?.length;
        params.page++;
      } while (total === params.limit);
    },
  },
};
