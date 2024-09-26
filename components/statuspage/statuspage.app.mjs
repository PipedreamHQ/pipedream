import { axios } from "@pipedream/platform";
import constants from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "statuspage",
  propDefinitions: {
    pageId: {
      label: "Page ID",
      description: "The ID of the page",
      type: "string",
      async options() {
        const pages = await this.getPages();

        return pages.map((page) => ({
          label: page.name,
          value: page.id,
        }));
      },
    },
    incidentId: {
      label: "Incident ID",
      description: "The ID of the incident",
      type: "string",
      async options({
        pageId, page,
      }) {
        const incidents = await this.getIncidents({
          pageId,
          params: {
            page: page + 1,
          },
        });

        return incidents.map((incident) => ({
          label: incident.name,
          value: incident.id,
        }));
      },
    },
    componentId: {
      label: "Component ID",
      description: "The ID of the component",
      type: "string",
      async options({
        pageId, page,
      }) {
        const components = await this.getComponents({
          pageId,
          params: {
            page: page + 1,
            per_page: 100,
          },
        });

        return components.map((incident) => ({
          label: incident.name,
          value: incident.id,
        }));
      },
    },
    status: {
      label: "Status",
      description: "The status of the incident. (e.g. `resolved`, `investigating`)",
      type: "string",
      options: constants.INCIDENT_STATUSES,
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _pageId() {
      return this.$auth.page_id;
    },
    _apiUrl() {
      return "https://api.statuspage.io/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `OAuth ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async createWebhook({
      pageId, ...args
    }) {
      return this._makeRequest({
        path: `/pages/${pageId}/subscribers`,
        method: "post",
        ...args,
      });
    },
    async removeWebhook({
      pageId, webhookId, ...args
    }) {
      return this._makeRequest({
        path: `/pages/${pageId}/subscribers/${webhookId}`,
        method: "delete",
        ...args,
      });
    },
    async getPages(args = {}) {
      return this._makeRequest({
        path: "/pages",
        ...args,
      });
    },
    async createIncident({
      pageId, ...args
    }) {
      return this._makeRequest({
        path: `/pages/${pageId}/incidents`,
        method: "post",
        ...args,
      });
    },
    async updateIncident({
      pageId, incidentId, ...args
    }) {
      return this._makeRequest({
        path: `/pages/${pageId}/incidents/${incidentId}`,
        method: "patch",
        ...args,
      });
    },
    async getIncidents({
      pageId, ...args
    }) {
      return this._makeRequest({
        path: `/pages/${pageId}/incidents`,
        ...args,
      });
    },
    async getComponents({
      pageId, ...args
    }) {
      return this._makeRequest({
        path: `/pages/${pageId}/components`,
        ...args,
      });
    },
  },
};
