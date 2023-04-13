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
      optional: true,
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
      description: "The contact to create a comment/record on",
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
    commentType: {
      type: "string",
      label: "Comment Type",
      description: "Type of message",
      options: constants.COMMENT_TYPES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.magnetichq.com/Magnetic/rest";
    },
    async _makeRequest({
      $ = this,
      path,
      params = {},
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          token: `${this.$auth.token}`,
        },
        ...args,
      }; console.log(config);
      return axios($, config);
    },
    getUser(args = {}) {
      return this._makeRequest({
        path: "/coreAPI/user",
        ...args,
      });
    },
    getGrouping(args = {}) {
      return this._makeRequest({
        path: "/tasksAPI/grouping",
        ...args,
      });
    },
    listGroupings(args = {}) {
      return this._makeRequest({
        path: "/tasksAPI/groupings",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/coreAPI/users",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/clientsAPI/contacts",
        ...args,
      });
    },
    listTasks(args = {}) {
      return this._makeRequest({
        path: "/tasksAPI/tasks",
        ...args,
      });
    },
    createTask(args = {}) {
      return this._makeRequest({
        path: "/tasksAPI/task",
        method: "POST",
        ...args,
      });
    },
    createContactComment(args = {}) {
      return this._makeRequest({
        path: "/clientsAPI/contactComment",
        method: "POST",
        ...args,
      });
    },
  },
};
