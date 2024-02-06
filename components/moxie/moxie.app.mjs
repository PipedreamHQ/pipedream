import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "moxie",
  propDefinitions: {
    clientName: {
      type: "string",
      label: "Client",
      description: "Name of a client",
      async options() {
        const clients = await this.listClients();
        return clients?.map(({ name }) => name ) || [];
      },
    },
    projectName: {
      type: "string",
      label: "Project",
      description: "Name of a project",
      async options({ clientName }) {
        if (!clientName) {
          return [];
        }
        const projects = await this.listProjects({
          params: {
            query: clientName,
          },
        });
        return projects?.map(({ name }) => name ) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.base_url}`;
    },
    _headers() {
      return {
        "X-API-KEY": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
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
    listClients(args = {}) {
      return this._makeRequest({
        path: "action/clients/list",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "action/projects/search",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "action/contacts/search",
        ...args,
      });
    },
    createClient(args = {}) {
      return this._makeRequest({
        path: "action/clients/create",
        method: "POST",
        ...args,
      });
    },
    createTask(args = {}) {
      return this._makeRequest({
        path: "action/tasks/create",
        method: "POST",
        ...args,
      });
    },
  },
};
