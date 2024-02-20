import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tableau",
  propDefinitions: {
    siteId: {
      type: "string",
      label: "Site ID",
      description: "The ID of the site where the project or event is located",
    },
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the new project to create",
    },
    parentProjectId: {
      type: "string",
      label: "Parent Project ID",
      description: "The ID of the parent project under which the new project will be created",
      optional: true,
    },
    workbookName: {
      type: "string",
      label: "Workbook Name",
      description: "The name of the workbook to track for creation events",
      optional: true,
    },
    webhookName: {
      type: "string",
      label: "Webhook Name",
      description: "The name of the webhook to create",
      optional: true,
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event to create a webhook for",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL that Tableau will send event notifications to",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tableau.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Tableau-Auth": this.$auth.oauth_access_token,
        },
        data,
        params,
      });
    },
    async createProject({
      siteId, projectName, parentProjectId,
    }) {
      const data = {
        project: {
          name: projectName,
          parentProjectId,
        },
      };
      return this._makeRequest({
        method: "POST",
        path: `/api/3.6/sites/${siteId}/projects`,
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
    },
    async listProjects({ siteId }) {
      return this._makeRequest({
        path: `/api/3.6/sites/${siteId}/projects`,
      });
    },
    async createWebhook({
      siteId, webhookName, eventName, webhookUrl,
    }) {
      const data = {
        webhook: {
          name: webhookName,
          event: eventName,
          webhookDestination: {
            webhookDestinationHttp: {
              method: "POST",
              url: webhookUrl,
            },
          },
        },
      };
      return this._makeRequest({
        method: "POST",
        path: `/api/3.6/sites/${siteId}/webhooks`,
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
    },
    async emitEvent(eventType, eventData) {
      this.$emit(eventData, {
        summary: `${eventType} event occurred`,
        id: eventData.resource_luid,
        ts: Date.now(),
      });
    },
  },
  version: "0.0.{{ts}}",
};
