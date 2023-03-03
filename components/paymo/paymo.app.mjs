import { v4 as uuid } from "uuid";
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "paymo",
  propDefinitions: {
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client to which the project belongs.",
      async options() {
        const { clients } = await this.listClients({
          params: {
            ["where=active"]: true,
          },
        });
        return clients.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project to which the task belongs.",
      async options() {
        const { projects } = await this.listProjects({
          params: {
            ["where=active"]: true,
          },
        });
        return projects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskListId: {
      type: "string",
      label: "Task List ID",
      description: "The ID of the task list to which the task belongs.",
      async options() {
        const { tasklists } = await this.listTaskLists();
        return tasklists.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...headers,
      };
    },
    getAuth() {
      return {
        username: this.$auth.api_key,
        password: uuid(),
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {
      const config = {
        auth: this.getAuth(),
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };
      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    listClients(args = {}) {
      return this.makeRequest({
        path: "/clients",
        ...args,
      });
    },
    listTasks(args = {}) {
      return this.makeRequest({
        path: "/tasks",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this.makeRequest({
        path: "/projects",
        ...args,
      });
    },
    listTaskLists(args = {}) {
      return this.makeRequest({
        path: "/tasklists",
        ...args,
      });
    },
  },
};
