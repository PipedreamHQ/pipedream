const axios = require("axios");
const eventTypes = [
  { label: "Create", value: "create"},
  { label: "Update", value: "update"},
  { label: "Delete", value: "delete"},
];
const resourceNames = [
  "Projects",
  "Prime Contracts",
  "Change Order Requests",
  "RFIs",
  "Submittals",
];

module.exports = {
  type: "app",
  app: "procore",
  propDefinitions: {
    company: {
      type: "integer",
      label: "Company",
      async options({ page, prevContext }) {
        const limit = 100;
        let offset = prevContext.offset || 0;
        const results = await this.listCompanies(limit, offset);
        const options = [];
        for (const company of results)
          options.push({ label: company.name, value: company.id });
        return {
          options,
          context: { limit, offset: offset + limit },
        };
      },
    },
    project: {
      type: "string",
      label: "Project",
      async options({ page, prevContext, company }) {
        const limit = 100;
        let offset = prevContext.offset || 0;
        const results = await this.listProjects(company, limit, offset);
        const options = [];
        for (const project of results)
          options.push({ label: project.name, value: project.id });
        return {
          options,
          context: { limit, offset: offset + limit, company },
        };
      },
    },
    resourceName: {
      type: "string",
      label: "Resource",
      description:
        "The type of resource on which to trigger events.",
      options: resourceNames,
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description:
        "Only events of the selected event type will be emitted.",
      options: eventTypes,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.procore.com/rest/v1.0";
    },
    _getHeaders(companyId=null) {
      let headers = {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
      if (companyId) headers["Procore-Company-Id"] = companyId;
      return headers;
    },
    async _makeGetRequest(endpoint, perPage=null, page=null, params={}, companyId=null) {
      let config = {
        method: "GET",
        url: `${this._getBaseUrl()}/${endpoint}`,
        headers: this._getHeaders(companyId),
        params,
      }
      if (perPage) config.params.per_page = perPage;
      if (page) config.params.page = page;
      return (await axios(config)).data;
    },
    async _makePostRequest(endpoint, data={}, companyId=null) {
      const config = {
        method: "POST",
        url: `${this._getBaseUrl()}/${endpoint}`,
        headers: this._getHeaders(companyId),
        data,
      }
      return (await axios(config)).data;
    },
    async _makeDeleteRequest(endpoint, companyId, projectId) {
      const config = {
        method: "DELETE",
        url: `${this._getBaseUrl()}/${endpoint}`,
        headers: this._getHeaders(companyId),
        params: {
          company_id: companyId,
          project_id: projectId,
        }
      }
      return (await axios(config)).data;
    },
    async createHook(destinationUrl, companyId, projectId) {
      const data = {
        company_id: companyId,
        project_id: projectId,
        hook: {
          "api_version": "v1.0",
          destination_url: destinationUrl,
        }
      }
      return await this._makePostRequest("webhooks/hooks", data, companyId);
    },
    async createHookTrigger(hookId, companyId, projectId, resourceName, eventType) {
      const data = {
        company_id: companyId,
        project_id: projectId,
        "api_version": "v1.0",
        trigger: {
          resource_name: resourceName,
          event_type: eventType,
        }
      }
      return await this._makePostRequest(`webhooks/hooks/${hookId}/triggers`, data, companyId);
    },
    async deleteHook(id, companyId, projectId) {
      return await this._makeDeleteRequest(`webhooks/hooks/${id}`, companyId, projectId);
    },
    async deleteHookTrigger(hookId, triggerId, companyId, projectId) {
      return await this._makeDeleteRequest(`webhooks/hooks/${hookId}/triggers/${triggerId}`, companyId, projectId);
    },
    async listCompanies(perPage, page) {
      return await this._makeGetRequest("companies", perPage, page);
    },
    async listProjects(companyId, perPage, page) {
      return await this._makeGetRequest("projects", perPage, page, { company_id: companyId }, companyId);
    },
    async getRFI(companyId, projectId, rfiId) {
      return await this._makeGetRequest(`projects/${projectId}/rfis/${rfiId}`, null, null, {}, companyId);
    }
  },
};
