import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sonarcloud",
  propDefinitions: {
    organization: {
      type: "string",
      label: "Organization",
      description: "The key of the organization that will own the webhook.",
      async options({ page }) {
        const { organizations } = await this.listOrganizations({
          params: {
            p: page + 1,
            member: true,
          },
        });

        return organizations.map(({
          key: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    project: {
      type: "string",
      label: "Project",
      description: "The key of the project that will own the webhook.",
      async options({
        page, organization,
      }) {
        const { components } = await this.listProjects({
          params: {
            p: page + 1,
            organization,
          },
        });

        return components.map(({
          key: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.token}@sonarcloud.io/api`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/create",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/delete",
        ...opts,
      });
    },
    listOrganizations(opts = {}) {
      return this._makeRequest({
        path: "/organizations/search",
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects/search",
        ...opts,
      });
    },
  },
};
