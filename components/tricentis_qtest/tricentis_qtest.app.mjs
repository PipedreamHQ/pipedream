import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tricentis_qtest",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of a project",
      async options() {
        const projects = await this.getProjects();
        return (projects ?? []).map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    parentId: {
      type: "string",
      label: "Parent ID",
      description: "The parent module which will contain the newly created requirement",
      async options({ projectId }) {
        const modules = await this.getModules(projectId);
        return (modules ?? []).map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    requirementId: {
      type: "string",
      label: "Requirement ID",
      description: "The ID of a requirement",
      async options({
        page, projectId,
      }) {
        const requirements = await this.getRequirements({
          page,
          projectId,
        });
        return (requirements ?? []).map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    useFields: {
      type: "boolean",
      label: "Set Field Values",
      description: "Set to `true` to see available fields.",
      reloadProps: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.qtest_base_uri}/api/v3`;
    },
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    createRequirement({
      projectId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/projects/${projectId}/requirements`,
        ...args,
      });
    },
    getRequirement({
      projectId, requirementId, ...args
    }) {
      return this._makeRequest({
        url: `/projects/${projectId}/requirements/${requirementId}`,
        ...args,
      });
    },
    getRequirementFields(projectId) {
      return this._makeRequest({
        url: `/projects/${projectId}/settings/requirements/fields`,
      });
    },
    getModules(projectId) {
      return this._makeRequest({
        url: `/projects/${projectId}/modules`,
      });
    },
    getProjects() {
      return this._makeRequest({
        url: "/projects",
      });
    },
    getRequirements({
      projectId, ...args
    }) {
      return this._makeRequest({
        url: `/projects/${projectId}/requirements`,
        ...args,
      });
    },
  },
};
