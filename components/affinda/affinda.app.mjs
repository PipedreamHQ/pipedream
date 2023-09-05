import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "affinda",
  propDefinitions: {
    organization: {
      type: "string",
      label: "Organization",
      description: "The organization identifier.",
      async options() {
        const response = await this._makeRequest({
          path: "/organizations",
        });
        return response.map((org) => ({
          label: org.name,
          value: org.identifier,
        }));
      },
    },
    workspace: {
      type: "string",
      label: "Workspace",
      description: "The workspace identifier.",
      async options({ organization }) {
        const response = await this._makeRequest({
          path: "/workspaces",
          params: {
            organization,
          },
        });
        return response.map((workspace) => ({
          label: workspace.name,
          value: workspace.identifier,
        }));
      },
    },
    collection: {
      type: "string",
      label: "Collection",
      description: "The collection identifier.",
      async options({ workspace }) {
        const response = await this._makeRequest({
          path: "/collections",
          params: {
            workspace,
          },
        });
        return response.map((collection) => ({
          label: collection.name,
          value: collection.identifier,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://${this.$auth.api}.affinda.com/v3`;
    },
    async _makeRequest({
      $ = this, path = "", ...config
    }) {
      return axios($, {
        url: this._getBaseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
          Accept: "application/json",
        },
        ...config,
      });
    },
    async uploadDocument({ ...config }) {
      return this._makeRequest({
        ...config,
        path: "/documents",
        method: "POST",
      });
    },
  },
};
