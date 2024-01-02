import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "coldstream",
  version: "0.0.{{ts}}",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The ID of the project in ColdStream",
    },
    caseId: {
      type: "integer",
      label: "Case ID",
      description: "The ID of the case in ColdStream",
    },
    organizationId: {
      type: "integer",
      label: "Organization ID",
      description: "The ID of the organization in ColdStream",
      async options({ $ }) {
        const { data } = await this.getCurrentUserOrganizations($);
        return data.map((org) => ({
          label: org.name,
          value: org.id,
        }));
      },
    },
    caseType: {
      type: "integer",
      label: "Case Type",
      description: "The type of the case",
      options: [
        {
          label: "Simulation",
          value: 1,
        },
      ],
    },
    asyncProjectId: {
      type: "integer",
      label: "Async Project ID",
      description: "The project ID used for asynchronous operations",
    },
    asyncCaseId: {
      type: "integer",
      label: "Async Case ID",
      description: "The case ID used for asynchronous operations",
    },
    caseName: {
      type: "string",
      label: "Case Name",
      description: "The name of the case",
    },
    caseStatus: {
      type: "integer[]",
      label: "Case Status",
      description: "Status of the case",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.coldstream.diabatix.com";
    },
    async _makeRequest({
      $, method, path, data, params, headers,
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        data,
        params,
        headers,
      });
    },
    async getCurrentUserOrganizations($) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/users/me/organizations",
      });
    },
    async getProject({ projectId }) {
      return this._makeRequest({
        method: "GET",
        path: `/projects/${projectId}`,
      });
    },
    async updateProject({
      projectId, data,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/projects/${projectId}`,
        data,
      });
    },
    async createCase({
      caseType, caseName,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/cases",
        data: {
          type: caseType,
          name: caseName,
        },
      });
    },
    async submitCase({
      caseId, data,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/cases/${caseId}/submit`,
        data,
      });
    },
    async getCaseResults({ caseId }) {
      return this._makeRequest({
        method: "GET",
        path: `/cases/${caseId}/results`,
      });
    },
    async listOrganizationCases({
      organizationId, params,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/organizations/${organizationId}/cases`,
        params,
      });
    },
    async listProjectCases({
      projectId, params,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/projects/${projectId}/cases`,
        params,
      });
    },
  },
};
