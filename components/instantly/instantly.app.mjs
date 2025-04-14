import { axios } from "@pipedream/platform";
import {
  EVENT_TYPE_OPTIONS,
  LIMIT,
  NEW_STATUS_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "instantly",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign",
      async options({ prevContext }) {
        const {
          items, next_starting_after: next,
        } = await this.listCampaigns({
          params: {
            limit: LIMIT,
            starting_after: prevContext?.next,
          },
        });
        return {
          options: items?.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })) || [],
          context: {
            next,
          },
        };
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tags ID",
      description: "List of tag IDs to add",
      async options({ prevContext }) {
        const {
          items, next_starting_after: next,
        } = await this.listTags({
          params: {
            limit: LIMIT,
            starting_after: prevContext?.next,
          },
        });
        return {
          options: items?.map(({
            id: value, label,
          }) => ({
            label,
            value,
          })) || [],
          context: {
            next,
          },
        };
      },
    },
    leadIds: {
      type: "string[]",
      label: "Lead IDs",
      description: "The array of lead IDs to include",
      async options({
        prevContext, valueKey = "id",
      }) {
        const {
          items, next_starting_after: next,
        } = await this.listLeads({
          params: {
            limit: LIMIT,
            starting_after: prevContext?.next,
          },
        });
        return {
          options: items?.map((lead) => ({
            label: (`${lead?.first_name} ${lead?.last_name}`).trim(),
            value: lead[valueKey],
          })) || [],
          context: {
            next,
          },
        };
      },
    },
    skipIfInWorkspace: {
      type: "boolean",
      label: "Skip if in Workspace",
      description: "Skip lead if it exists in any campaigns in the workspace",
      optional: true,
    },
    skipIfInCampaign: {
      type: "boolean",
      label: "Skip if in Campaign",
      description: "Skip lead if it exists in the campaign",
      optional: true,
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Type of event to filter",
      options: EVENT_TYPE_OPTIONS,
    },
    newStatus: {
      type: "string",
      label: "New Status",
      description: "Lead interest status. It can be either a static value, or a custom status interest value.",
      options: NEW_STATUS_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.instantly.ai/api/v2";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, headers, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/custom-tags",
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/leads/list",
        ...opts,
      });
    },
    getBackgroundJob({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/background-jobs/${jobId}`,
        ...opts,
      });
    },
    addTagsToCampaign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/custom-tags/toggle-resource",
        ...opts,
      });
    },
    addLeadsToCampaign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/leads/move",
        ...opts,
      });
    },
    updateLeadStatus(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/leads/update-interest-status",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/subscribe",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/unsubscribe",
        ...opts,
      });
    },
  },
};
