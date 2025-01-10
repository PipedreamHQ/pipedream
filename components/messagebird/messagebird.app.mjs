import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "messagebird",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The unique identifier of an organization. Found in Organization Settings",
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The unique identifier of a workspace",
      async options({
        organizationId, prevContext,
      }) {
        if (!organizationId) {
          return [];
        }
        const { next: pageToken } = prevContext;
        const {
          results, nextPageToken,
        } = await this.listWorkspaces({
          organizationId,
          params: pageToken
            ? {
              pageToken,
            }
            : {},
        });
        return {
          options: results?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next: nextPageToken,
          },
        };
      },
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The unique identifier of a channel",
      async options({
        workspaceId, prevContext,
      }) {
        if (!workspaceId) {
          return [];
        }
        const { next: pageToken } = prevContext;
        const {
          results, nextPageToken,
        } = await this.listChannels({
          workspaceId,
          params: pageToken
            ? {
              pageToken,
            }
            : {},
        });
        return {
          options: results?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next: nextPageToken,
          },
        };
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The contact to send the message to",
      async options({
        workspaceId, prevContext,
      }) {
        if (!workspaceId) {
          return [];
        }
        const { next: pageToken } = prevContext;
        const {
          results, nextPageToken,
        } = await this.listContacts({
          workspaceId,
          params: pageToken
            ? {
              pageToken,
            }
            : {},
        });
        return {
          options: results?.map(({
            id: value, computedDisplayName: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next: nextPageToken,
          },
        };
      },
    },
    listIds: {
      type: "string[]",
      label: "List IDs",
      description: "An array of unique list identifiers to add the contact to",
      optional: true,
      async options({ workspaceId }) {
        if (!workspaceId) {
          return [];
        }
        const { results } = await this.listLists({
          workspaceId,
        });
        return results?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bird.com";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `AccessKey ${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },
    createWebhook({
      organizationId, workspaceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/organizations/${organizationId}/workspaces/${workspaceId}/webhook-subscriptions`,
        ...opts,
      });
    },
    deleteWebhook({
      organizationId, workspaceId, hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/organizations/${organizationId}/workspaces/${workspaceId}/webhook-subscriptions/${hookId}`,
        ...opts,
      });
    },
    listWorkspaces({
      organizationId, ...opts
    }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/workspaces`,
        ...opts,
      });
    },
    listChannels({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/channels`,
        ...opts,
      });
    },
    listLists({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/lists`,
        ...opts,
      });
    },
    listContacts({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/contacts`,
        ...opts,
      });
    },
    createContact({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/contacts`,
        ...opts,
      });
    },
    sendVoiceMessage({
      workspaceId, channelId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/channels/${channelId}/calls`,
        ...opts,
      });
    },
    sendSmsMessage({
      workspaceId, channelId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/channels/${channelId}/messages`,
        ...opts,
      });
    },
  },
};
