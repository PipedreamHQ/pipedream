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
      async options({ page }) {
        const campaigns = await this.listCampaigns({
          params: {
            limit: LIMIT,
            skip: LIMIT * page,
          },
        });
        return campaigns.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tags Id",
      description: "List of tag Ids to add",
      async options({ page }) {
        const { data } = await this.listTags({
          params: {
            limit: LIMIT,
            skip: LIMIT * page,
          },
        });
        return data.map(({
          id: value, label,
        }) => ({
          label,
          value,
        }));
      },
    },
    leads: {
      type: "string[]",
      label: "Leads",
      description: "An array of lead objects to add to the campaign. **Example: [{ \"email\":\"john2@abc.com\", \"first_name\":\"John\", \"last_name\":\"Doe\", \"company_name\":\"Instantly\", \"personalization\":\"Loved your latest post\", \"phone\":\"123456789\", \"website\":\"instantly.ai\", \"custom_variables\":{ \"favorite_restaurant\":\"Chipotle\", \"language\":\"English\"}}]**",
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
    email: {
      type: "string",
      label: "Lead Email",
      description: "Email address of the lead",
    },
    newStatus: {
      type: "string",
      label: "New Status",
      description: "New status to assign to the lead",
      options: NEW_STATUS_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.instantly.ai/api/v1";
    },
    _params(params = {}) {
      return {
        ...params,
        api_key: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, params, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        params: this._params(params),
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaign/list",
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/custom-tag",
        ...opts,
      });
    },
    addTagsToCampaign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/custom-tag/toggle-tag-resource",
        ...opts,
      });
    },
    addLeadsToCampaign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/lead/add",
        ...opts,
      });
    },
    updateLeadStatus(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/lead/update/status",
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
