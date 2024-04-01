import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "parsehub",
  propDefinitions: {
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project to trigger a new run for",
      required: true,
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The unique identifier of the project",
      required: true,
    },
    runToken: {
      type: "string",
      label: "Run Token",
      description: "The token of the run to retrieve data for",
      required: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.parsehub.com/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async getProjectDetails({ projectId }) {
      return this._makeRequest({
        path: `/projects/${projectId}`,
        params: {
          api_key: this.$auth.api_key,
        },
      });
    },
    async runProject({ projectId }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/run`,
        data: {
          api_key: this.$auth.api_key,
        },
      });
    },
    async getRunData({ runToken }) {
      return this._makeRequest({
        path: `/runs/${runToken}/data`,
        params: {
          api_key: this.$auth.api_key,
        },
      });
    },
    async emitEvents({ projectName }) {
      console.log(`New event emitted for project: ${projectName}`);
      // Placeholder for event emission logic
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
