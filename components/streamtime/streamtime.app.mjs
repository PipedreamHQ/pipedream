import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "streamtime",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User",
      description: "Identifier of a user",
      optional: true,
      async options() {
        const users = await this.listUsers();
        return users?.map(({
          id: value, firstName, lastName,
        }) => ({
          value,
          label: `${firstName} ${lastName}`.trim(),
        })) || [];
      },
    },
    companyId: {
      type: "string",
      label: "Company",
      description: "Identifier of a company",
      async options({ page }) {
        const { searchResults: companies } = await this.listCompanies({
          data: {
            ...constants.COMPANY_SEARCH_BASE_PARAMS,
            offset: page * constants.COMPANY_SEARCH_BASE_PARAMS.maxResults,
          },
        });
        return companies?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    toDoId: {
      type: "string",
      label: "To Do",
      description: "Identifier of a to do",
      async options({ page }) {
        const { searchResults } = await this.listToDos({
          data: {
            ...constants.TODO_SEARCH_BASE_PARAMS,
            offset: page * constants.TODO_SEARCH_BASE_PARAMS.maxResults,
          },
        });
        const toDos = [];
        for (const [
          // eslint-disable-next-line no-unused-vars
          key,
          value,
        ] of Object.entries(searchResults)) {
          toDos.push({
            label: value.itemName,
            value: value.id,
          });
        }
        return toDos;
      },
    },
    jobId: {
      type: "string",
      label: "Job",
      description: "Identifier of a job",
      optional: true,
      async options({ page }) {
        const { searchResults: jobs } = await this.listJobs({
          data: {
            ...constants.JOB_SEARCH_BASE_PARAMS,
            offset: page * constants.JOB_SEARCH_BASE_PARAMS.maxResults,
          },
        });
        return jobs?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    contactId: {
      type: "string",
      label: "Contact",
      description: "Identifier of a contact",
      async options({ companyId }) {
        const contacts = await this.listContacts({
          companyId,
        });
        return contacts?.map(({
          id: value, firstName, lastName,
        }) => ({
          value,
          label: `${firstName} ${lastName}`.trim(),
        })) || [];
      },
    },
    statusId: {
      type: "integer",
      label: "Status",
      description: "Status of the To Do",
      optional: true,
      options: constants.LOGGED_TIME_STATUS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.streamtime.net/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
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
    getToDo({
      toDoId, ...args
    }) {
      return this._makeRequest({
        path: `/logged_times/${toDoId}`,
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    listContacts({
      companyId, ...args
    }) {
      return this._makeRequest({
        path: `/companies/${companyId}/contacts`,
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this._makeRequest({
        path: "/companies/search",
        method: "POST",
        ...args,
      });
    },
    listToDos(args = {}) {
      return this._makeRequest({
        path: "/logged_times/search",
        method: "POST",
        ...args,
      });
    },
    listJobs(args = {}) {
      return this._makeRequest({
        path: "/jobs/search",
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
    createContact({
      companyId, ...args
    }) {
      return this._makeRequest({
        path: `/companies/${companyId}/contacts`,
        method: "POST",
        ...args,
      });
    },
    updateToDo({
      toDoId, ...args
    }) {
      return this._makeRequest({
        path: `/logged_times/${toDoId}`,
        method: "PUT",
        ...args,
      });
    },
  },
};
