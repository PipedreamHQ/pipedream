import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "peaka",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The Project ID to execute the query against.",
      async options() {
        const response = await this.listProjects();
        return response.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://partner.peaka.studio/api/v1";
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        debug: true,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
  },
};
