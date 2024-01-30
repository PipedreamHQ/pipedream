import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "semgrep",
  propDefinitions: {
    deploymentSlug: {
      type: "string",
      label: "Deployment Slug",
      description: "The slug identifier for the deployment",
      async options({ prevContext }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const { deployments } = await this.listDeployments({
          params: {
            page,
          },
        });
        return {
          options: deployments.map((deployment) => ({
            label: deployment.name,
            value: deployment.slug,
          })),
          context: {
            page: page + 1,
          },
        };
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
        return projects.map((project) => ({
          label: project.name,
          value: project.name,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Optional tags for the project",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://semgrep.dev/api/v1";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
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
      deploymentSlug, projectName, tags, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/deployments/${deploymentSlug}/projects/${projectName}`,
        data: tags
          ? {
            tags,
          }
          : {},
        ...opts,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
