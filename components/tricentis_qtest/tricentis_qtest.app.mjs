import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tricentis_qtest",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of a project. Use the **List Project ID Options** action to retrieve available project IDs.",
    },
    parentId: {
      type: "string",
      label: "Parent ID",
      description: "The ID of the parent module which will contain the newly created requirement. Use the **List Modules** action to retrieve available module IDs.",
    },
    requirementId: {
      type: "string",
      label: "Requirement ID",
      description: "The ID of a requirement. Use the **List Requirements** action to retrieve available requirement IDs.",
    },
    defectId: {
      type: "string",
      label: "Defect ID",
      description: "The ID of a defect. Use the **List Defects** action to retrieve available defect IDs.",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for paginated results (1-based)",
      optional: true,
      default: 1,
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "A JSON array of field properties to set on the record. Use **List Requirement Fields** to discover requirement field IDs, or **List Defect Fields** to discover defect field IDs. Example: `[{\"field_id\": 3, \"field_value\": \"1\"}]`",
      optional: true,
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
    getProjects({ $ } = {}) {
      return this._makeRequest({
        $,
        url: "/projects",
      });
    },
    getModules({
      projectId, $,
    }) {
      return this._makeRequest({
        $,
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
    getRequirementFields({
      projectId, $,
    }) {
      return this._makeRequest({
        $,
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
    getDefectFields({
      projectId, $,
    }) {
      return this._makeRequest({
        $,
        url: `/projects/${projectId}/settings/defects/fields`,
      });
    },
  },
};
