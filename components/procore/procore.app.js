const axios = require("axios");
const eventTypes = [
  {
    label: "Create",
    value: "create",
  },
  {
    label: "Update",
    value: "update",
  },
  {
    label: "Delete",
    value: "delete",
  },
];
const resourceNames = [
  "Budget View Snapshots",
  "Change Events",
  "Change Order Packages",
  "Projects",
  "Prime Contracts",
  "Purchase Order Contracts",
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
      description: "Select the company to watch for changes in.",
      async options({ prevContext }) {
        const limit = 100;
        const { offset = 0 } = prevContext;
        const results = await this.listCompanies(limit, offset);
        const options = results.map((c) => ({
          label: c.name,
          value: c.id,
        }));
        return {
          options,
          context: {
            limit,
            offset: offset + limit,
          },
        };
      },
    },
    project: {
      type: "integer",
      label: "Project",
      description:
        "Select the project to watch for changes in. Leave blank for company-level resources (eg. Projects).",
      optional: true,
      async options({
        prevContext, company,
      }) {
        const limit = 100;
        const { offset = 0 } = prevContext;
        const results = await this.listProjects(company, limit, offset);
        const options = results.map((p) => ({
          label: p.name,
          value: p.id,
        }));
        return {
          options,
          context: {
            limit,
            offset: offset + limit,
            company,
          },
        };
      },
    },
    resourceName: {
      type: "string",
      label: "Resource",
      description: "The type of resource on which to trigger events.",
      options: resourceNames,
    },
    eventTypes: {
      type: "string[]",
      label: "Event Type",
      description: "Only events of the selected event type will be emitted.",
      options: eventTypes,
    },
  },
  methods: {
    getEventTypes() {
      return eventTypes.map(({ value }) => value);
    },
    _getBaseUrl() {
      return "https://api.procore.com/rest/v1.0";
    },
    _getHeaders(companyId = null) {
      let headers = {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
      if (companyId) headers["Procore-Company-Id"] = companyId;
      return headers;
    },
    async _makeRequest(
      method,
      endpoint,
      companyId = null,
      params = null,
      data = null,
    ) {
      const config = {
        method,
        url: `${this._getBaseUrl()}/${endpoint}`,
        headers: this._getHeaders(companyId),
      };
      if (params) config.params = params;
      else if (data) config.data = data;
      return (await axios(config)).data;
    },
    async createHook(destinationUrl, companyId, projectId) {
      const data = {
        hook: {
          api_version: "v1.0",
          destination_url: destinationUrl,
        },
      };
      if (projectId) data.project_id = projectId;
      else if (companyId) data.company_id = companyId;
      return await this._makeRequest(
        "POST",
        "webhooks/hooks",
        companyId,
        null,
        data,
      );
    },
    async createHookTrigger(
      hookId,
      companyId,
      projectId,
      resourceName,
      eventType,
    ) {
      const data = {
        api_version: "v1.0",
        trigger: {
          resource_name: resourceName,
          event_type: eventType,
        },
      };
      if (projectId) data.project_id = projectId;
      else if (companyId) data.company_id = companyId;
      return await this._makeRequest(
        "POST",
        `webhooks/hooks/${hookId}/triggers`,
        companyId,
        null,
        data,
      );
    },
    async deleteHook(id, companyId, projectId) {
      const params = projectId
        ? {
          project_id: projectId,
        }
        : {
          company_id: companyId,
        };
      return await this._makeRequest(
        "DELETE",
        `webhooks/hooks/${id}`,
        companyId,
        params,
      );
    },
    async deleteHookTrigger(hookId, triggerId, companyId, projectId) {
      const params = projectId
        ? {
          project_id: projectId,
        }
        : {
          company_id: companyId,
        };
      return await this._makeRequest(
        "DELETE",
        `webhooks/hooks/${hookId}/triggers/${triggerId}`,
        companyId,
        params,
      );
    },
    async listCompanies(perPage, page) {
      return await this._makeRequest("GET", "companies", null, {
        per_page: perPage,
        page,
      });
    },
    async listProjects(companyId, perPage, page) {
      return await this._makeRequest("GET", "projects", companyId, {
        company_id: companyId,
        per_page: perPage,
        page,
      });
    },
    async getBudgetViewSnapshot(
      companyId,
      projectId,
      budgetViewSnapshotId,
      perPage,
      page,
    ) {
      return await this._makeRequest(
        "GET",
        `budget_view_snapshots/${budgetViewSnapshotId}/detail_rows`,
        companyId,
        {
          project_id: projectId,
          per_page: perPage,
          page,
        },
      );
    },
    async getChangeEvent(companyId, projectId, changeEventId) {
      return await this._makeRequest(
        "GET",
        `change_events/${changeEventId}`,
        companyId,
        {
          project_id: projectId,
        },
      );
    },
    async getChangeOrderPackage(companyId, projectId, changeOrderPackageId) {
      return await this._makeRequest(
        "GET",
        `change_order_packages/${changeOrderPackageId}`,
        companyId,
        {
          project_id: projectId,
        },
      );
    },
    async getPrimeContract(companyId, projectId, primeContractId) {
      return await this._makeRequest(
        "GET",
        `prime_contract/${primeContractId}`,
        companyId,
        {
          project_id: projectId,
        },
      );
    },
    async getPurchaseOrder(companyId, projectId, poId) {
      return await this._makeRequest(
        "GET",
        `purchase_order_contracts/${poId}`,
        companyId,
        {
          project_id: projectId,
        },
      );
    },
    async getRFI(companyId, projectId, rfiId) {
      return await this._makeRequest(
        "GET",
        `projects/${projectId}/rfis/${rfiId}`,
        companyId,
      );
    },
    async getSubmittal(companyId, projectId, submittalId) {
      return await this._makeRequest(
        "GET",
        `projects/${projectId}/submittals/${submittalId}`,
        companyId,
      );
    },
  },
};
