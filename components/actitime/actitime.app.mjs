import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "actitime",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user whose working time is updated.",
      async options({ prevContext: { nextOffset } }) {
        const {
          items,
          offset,
        } = await this.listUsers({
          limit: constants.DEFAULT_LIMIT,
          offset: nextOffset,
        });
        return {
          context: {
            nextOffset: offset,
          },
          options: items.map(({
            id: value,
            username: label,
          }) => ({
            value,
            label,
          })),
        };
      },
    },
    workflowStatusId: {
      type: "string",
      label: "Workflow Status ID",
      description: "The ID of the workflow status.",
      optional: true,
      async options({ prevContext: { nextOffset } }) {
        const {
          items,
          offset,
        } = await this.listWorkflowStatuses({
          limit: constants.DEFAULT_LIMIT,
          offset: nextOffset,
        });
        return {
          context: {
            nextOffset: offset,
          },
          options: items.map(({
            id: value,
            name: label,
          }) => ({
            value,
            label,
          })),
        };
      },
    },
    typeOfWorkId: {
      type: "string",
      label: "Type Of Work ID",
      description: "The ID of the type of work.",
      optional: true,
      async options({ prevContext: { nextOffset } }) {
        const {
          items,
          offset,
        } = await this.listTypesOfWork({
          limit: constants.DEFAULT_LIMIT,
          offset: nextOffset,
        });
        return {
          context: {
            nextOffset: offset,
          },
          options: items.map(({
            id: value,
            name: label,
          }) => ({
            value,
            label,
          })),
        };
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project.",
      async options({ prevContext: { nextOffset } }) {
        const {
          items,
          offset,
        } = await this.listProjects({
          limit: constants.DEFAULT_LIMIT,
          offset: nextOffset,
        });
        return {
          context: {
            nextOffset: offset,
          },
          options: items.map(({
            id: value,
            name: label,
          }) => ({
            value,
            label,
          })),
        };
      },
    },
    leaveTypeId: {
      type: "string",
      label: "Leave Type ID",
      description: "The ID of the leave type.",
      async options({ prevContext: { nextOffset } }) {
        const {
          items,
          offset,
        } = await this.leaveTypes({
          limit: constants.DEFAULT_LIMIT,
          offset: nextOffset,
        });
        return {
          context: {
            nextOffset: offset,
          },
          options: items.map(({
            id: value,
            name: label,
          }) => ({
            value,
            label,
          })),
        };
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${this.$auth.url}${constants.VERSION_PATH}${path}`;
    },
    getAuth() {
      const {
        email: username,
        password,
      } = this.$auth;
      return {
        username,
        password,
      };
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        auth: this.getAuth(),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        method: "PATCH",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    listWorkflowStatuses(args = {}) {
      return this._makeRequest({
        path: "/workflowStatuses",
        ...args,
      });
    },
    listTypesOfWork(args = {}) {
      return this._makeRequest({
        path: "/typesOfWork",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    leaveTypes(args = {}) {
      return this._makeRequest({
        path: "/leaveTypes",
        ...args,
      });
    },
  },
};
