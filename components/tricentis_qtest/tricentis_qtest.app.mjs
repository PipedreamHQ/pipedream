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
        page = 0, projectId,
      }) {
        const requirements = await this.getRequirements({
          projectId,
          params: {
            page: page + 1,
          },
        });
        return (requirements ?? []).map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    defectId: {
      type: "string",
      label: "Defect ID",
      description: "The ID of a defect. The listed options are defects that have been updated in the last 30 days.",
      async options({
        page = 0, projectId, prevContext: { startTime },
      }) {
        if (!startTime) {
          const date = new Date();
          date.setDate(date.getDate() - 30);
          startTime = date.toISOString();
        }
        const fields = await this.getDefectFields(projectId);
        const summaryId = fields.find(({ label }) => label === "Summary")?.id;
        const defects = await this.getDefects({
          projectId,
          params: {
            page: page + 1,
            startTime,
          },
        });
        return {
          options: (defects ?? []).map(({
            id, properties,
          }) => ({
            label: properties.find((f) => f.field_id === summaryId)?.field_value ?? id,
            value: id,
          })),
          context: {
            startTime,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.qtest_base_uri}/api/v3`;
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
    getProjects() {
      return this._makeRequest({
        url: "/projects",
      });
    },
    getModules(projectId) {
      return this._makeRequest({
        url: `/projects/${projectId}/modules`,
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
    getRequirements({
      projectId, ...args
    }) {
      return this._makeRequest({
        url: `/projects/${projectId}/requirements`,
        ...args,
      });
    },
    updateRequirement({
      projectId, requirementId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/projects/${projectId}/requirements/${requirementId}`,
        ...args,
      });
    },
    getRequirementFields(projectId) {
      return this._makeRequest({
        url: `/projects/${projectId}/settings/requirements/fields`,
      });
    },
    createDefect({
      projectId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/projects/${projectId}/defects`,
        ...args,
      });
    },
    getDefect({
      projectId, defectId, ...args
    }) {
      return this._makeRequest({
        url: `/projects/${projectId}/defects/${defectId}`,
        ...args,
      });
    },
    getDefects({
      projectId, ...args
    }) {
      return this._makeRequest({
        url: `/projects/${projectId}/defects/last-change`,
        ...args,
      });
    },
    updateDefect({
      projectId, defectId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/projects/${projectId}/defects/${defectId}`,
        ...args,
      });
    },
    getDefectFields(projectId) {
      return this._makeRequest({
        url: `/projects/${projectId}/settings/defects/fields`,
      });
    },
  },
};
