import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "semgrep",
  propDefinitions: {
    deploymentSlug: {
      type: "string",
      label: "Deployment Slug",
      description: "The slug identifier for the deployment",
      async options({ page }) {
        const { deployments } = await this.listDeployments({
          params: {
            page,
          },
        });

        return deployments.map(({
          name, slug,
        }) => ({
          label: name,
          value: slug,
        }));
      },
    },
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project",
      async options({ deploymentSlug }) {
        const { projects } = await this.listProjects({
          deploymentSlug,
        });
        return projects.map((project) => project.name);
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Optional tags for the project",
    },
  },
  methods: {
    _baseUrl() {
      return "https://semgrep.dev/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async listDeployments(opts = {}) {
      return this._makeRequest({
        path: "/deployments",
        ...opts,
      });
    },
    async listProjects({
      deploymentSlug, ...opts
    }) {
      return this._makeRequest({
        path: `/deployments/${deploymentSlug}/projects`,
        ...opts,
      });
    },
    async listFindings({
      deploymentSlug, ...opts
    }) {
      return this._makeRequest({
        path: `/deployments/${deploymentSlug}/findings`,
        ...opts,
      });
    },
    async updateProject({
      deploymentSlug, projectName, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/deployments/${deploymentSlug}/projects/${projectName}`,
        ...opts,
      });
    },
  },
};
