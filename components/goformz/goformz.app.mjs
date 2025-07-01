import { axios } from "@pipedream/platform";
const DEFAULT_PAGE_SIZE = 25;

export default {
  type: "app",
  app: "goformz",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use for the form",
      async options({ page }) {
        const templates = await this.listTemplates({
          params: {
            pageSize: DEFAULT_PAGE_SIZE,
            pageNumber: page + 1,
          },
        });
        return templates?.map((template) => ({
          label: template.name,
          value: template.id,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to assign the form to",
      async options({ page }) {
        const users = await this.listUsers({
          params: {
            pageSize: DEFAULT_PAGE_SIZE,
            pageNumber: page + 1,
          },
        });
        return users?.map((user) => ({
          label: user.username,
          value: user.id,
        })) || [];
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group to assign the form to",
      async options({ page }) {
        const groups = await this.listGroups({
          params: {
            pageSize: DEFAULT_PAGE_SIZE,
            pageNumber: page + 1,
          },
        });
        return groups?.map((group) => ({
          label: group.name,
          value: group.id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.goformz.com/v2";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
    getTemplate({
      templateId, ...opts
    }) {
      return this._makeRequest({
        path: `/templates/${templateId}`,
        ...opts,
      });
    },
    getForm({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/formz/${formId}`,
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/groups",
        ...opts,
      });
    },
    createForm( opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/formz",
        ...opts,
      });
    },
  },
};
