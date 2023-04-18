import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "magnetic",
  propDefinitions: {
    grouping: {
      type: "string",
      label: "Opportunity/Job",
      description: "The Opportunity/Job the task will be created in",
      optional: true,
      async options() {
        const groupings = await this.listGroupings();
        return groupings?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    user: {
      type: "string",
      label: "Task Owner",
      description: "The user who will be the owner of the task",
      async options() {
        const users = await this.listUsers();
        return users?.map(({
          id, fullName,
        }) => ({
          label: fullName,
          value: id,
        })) || [];
      },
    },
    contact: {
      type: "string",
      label: "Contact",
      description: "The identifier of a contact",
      async options() {
        const contacts = await this.listContacts();
        return contacts?.map(({
          id, fullName,
        }) => ({
          label: fullName,
          value: id,
        })) || [];
      },
    },
    company: {
      type: "string",
      label: "Company",
      description: "The identifier of a company",
      async options() {
        const contacts = await this.listCompanies();
        return contacts?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    task: {
      type: "string",
      label: "Task",
      description: "The identifier of a task",
      async options() {
        const tasks = await this.listTasks();
        return tasks?.map(({
          id, task,
        }) => ({
          label: task,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.magnetichq.com/Magnetic/rest";
    },
    async _makeRequest({
      $ = this,
      path,
      apiPath,
      params = {},
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${constants.API_PATH[apiPath]}${path}`,
        params: {
          ...params,
          token: `${this.$auth.token}`,
        },
        ...args,
      };
      return axios($, config);
    },
    getUser(args = {}) {
      return this._makeRequest({
        path: "/user",
        apiPath: "CORE_API",
        ...args,
      });
    },
    getTask(args = {}) {
      return this._makeRequest({
        path: "/task",
        apiPath: "TASKS_API",
        ...args,
      });
    },
    getGrouping(args = {}) {
      return this._makeRequest({
        path: "/grouping",
        apiPath: "TASKS_API",
        ...args,
      });
    },
    listGroupings(args = {}) {
      return this._makeRequest({
        path: "/groupings",
        apiPath: "TASKS_API",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        apiPath: "CORE_API",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        apiPath: "CLIENTS_API",
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this._makeRequest({
        path: "/companies",
        apiPath: "CLIENTS_API",
        ...args,
      });
    },
    listTasks(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        apiPath: "TASKS_API",
        ...args,
      });
    },
    createOrUpdateTask(args = {}) {
      return this._makeRequest({
        path: "/task",
        apiPath: "TASKS_API",
        method: "POST",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/contact",
        apiPath: "CLIENTS_API",
        method: "POST",
        ...args,
      });
    },
    createGrouping(args = {}) {
      return this._makeRequest({
        path: "/grouping",
        apiPath: "TASKS_API",
        method: "POST",
        ...args,
      });
    },
  },
};
