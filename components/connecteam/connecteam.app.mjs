import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "connecteam",
  propDefinitions: {
    assignedUserId: {
      type: "string",
      label: "Assigned User ID",
      description: "The ID of the assigned user.",
      async options({ page }) {
        const { data: { users } } = await this.listUsers({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return users.map(({
          email: label, userId: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form.",
      async options({ page }) {
        const { data: { forms } } = await this.listForms({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return forms.map(({
          formId: value, formName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job.",
      async options({ page }) {
        const { data: { jobs } } = await this.listJobs({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return jobs.map(({
          jobId: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    schedulerId: {
      type: "string",
      label: "Scheduler ID",
      description: "The ID of the scheduler.",
      async options() {
        const { data: { schedulers } } = await this.listSchedulers();
        return schedulers.map(({
          schedulerId: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    shiftId: {
      type: "string",
      label: "Shift ID",
      description: "The ID of the shift.",
      async options({
        schedulerId, page,
      }) {
        const date = new Date();
        const { data: { shifts } } = await this.listShifts({
          schedulerId,
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
            startTime: 1,
            endTime: date.setFullYear(date.getFullYear() + 1000),
          },
        });
        return shifts.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userType: {
      type: "string",
      label: "User Type",
      description: "The type of the user.",
      options: [
        "user",
        "manager",
        "owner",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.connecteam.com";
    },
    _headers() {
      return {
        "X-API-KEY": `${this.$auth.api_key}`,
        "accept": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listForms(opts = {}) {
      return this._makeRequest({
        path: "/forms/v1/forms",
        ...opts,
      });
    },
    listFormSubmissions({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/forms/v1/forms/${formId}/form-submissions`,
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/jobs/v1/jobs",
        ...opts,
      });
    },
    listSchedulers() {
      return this._makeRequest({
        path: "/scheduler/v1/schedulers",
      });
    },
    listShifts({
      schedulerId, ...opts
    }) {
      return this._makeRequest({
        path: `/scheduler/v1/schedulers/${schedulerId}/shifts`,
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users/v1/users",
        ...opts,
      });
    },
    createShift({
      schedulerId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/scheduler/v1/schedulers/${schedulerId}/shifts`,
        ...opts,
      });
    },
    deleteShift({
      schedulerId, shiftId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/scheduler/v1/schedulers/${schedulerId}/shifts/${shiftId}`,
        ...opts,
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users/v1/users",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, modelField, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page;
        page++;
        const { data } = await fn({
          params,
          ...opts,
        });
        for (const d of data[modelField]) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data[modelField].length;

      } while (hasMore);
    },
  },
};
