import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "affinda",
  propDefinitions: {
    organization: {
      type: "string",
      label: "Organization",
      description: "The organization",
      async options() {
        const organizations = await this.listOrganizations();
        return organizations.map((org) => ({
          label: org.name,
          value: org.identifier,
        }));
      },
    },
    workspace: {
      type: "string",
      label: "Workspace",
      description: "The workspace",
      async options({ organization }) {
        const workspaces = await this.listWorkspaces(organization);
        return workspaces.map((ws) => ({
          label: ws.name,
          value: ws.identifier,
        }));
      },
    },
    collection: {
      type: "string",
      label: "Collection",
      description: "The collection",
      async options({ workspace }) {
        const collections = await this.listCollections(workspace);
        return collections.map((col) => ({
          label: col.name,
          value: col.identifier,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.affinda.com/v3";
    },
    async _makeRequest(opts) {
      const {
        method = "get",
        path,
        params,
        ...otherOpts
      } = opts;
      return await axios(this, {
        ...otherOpts,
        method,
        url: `${this._getBaseUrl()}${path}`,
        headers: {
          ...opts.headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Accept": "application/json",
        },
        params,
      });
    },
    async createWebhook({ ...config }) {
      return this._makeRequest({
        ...config,
        method: "POST",
        path: "/resthook_subscriptions",
      });
    },
    async deleteWebhook({ id }) {
      await this._makeRequest({
        method: "DELETE",
        path: `/resthook_subscriptions/${id}`,
      });
    },
    async activateWebhook({ signature }) {
      await this._makeRequest({
        method: "POST",
        path: "/resthook_subscriptions/activate",
        headers: {
          "X-Hook-Secret": signature,
        },
      });
    },
    async listOrganizations() {
      const response = await this._makeRequest({
        path: "/organizations",
      });
      return response;
    },
    async listWorkspaces(organization) {
      const response = await this._makeRequest({
        path: "/workspaces",
        params: {
          organization,
        },
      });
      return response;
    },
    async listCollections(workspace) {
      const response = await this._makeRequest({
        path: "/collections",
        params: {
          workspace,
        },
      });
      return response;
    },
    async listDocuments({ ...config }) {
      return this._makeRequest({
        ...config,
        method: "GET",
        path: "/documents",
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
