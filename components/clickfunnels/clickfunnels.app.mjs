import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clickfunnels",
  propDefinitions: {
    tagId: {
      type: "string",
      label: "Tag Id",
      description: "The unique identification of the tag.",
      async options({
        workspaceId, prevContext: { after },
      }) {
        const data = await this.listTags({
          workspaceId,
          params: {
            after,
          },
        });

        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            after: data.length
              ? data[data.length - 1].id
              : null,
          },
        };
      },
    },
    teamId: {
      type: "string",
      label: "Team Id",
      description: "The unique identification of the team.",
      async options({ prevContext: { after } }) {
        const data = await this.listTeams({
          params: {
            after,
          },
        });

        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            after: data.length
              ? data[data.length - 1].id
              : null,
          },
        };
      },
    },
    workspaceId: {
      type: "string",
      label: "Workspace Id",
      description: "The unique identification of the workspace.",
      async options({
        teamId, prevContext: { after },
      }) {
        const data = await this.listWorkspaces({
          teamId,
          params: {
            after,
          },
        });

        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            after: data.length
              ? data[data.length - 1].id
              : null,
          },
        };
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      async options({
        workspaceId, prevContext: { after },
      }) {
        const data = await this.listContacts({
          workspaceId,
          params: {
            after,
          },
        });

        return {
          options: data.map(({
            id: value, email_address: label,
          }) => ({
            label,
            value,
          })),
          context: {
            after: data.length
              ? data[data.length - 1].id
              : null,
          },
        };
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.myclickfunnels.com/api/v2`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    applyTagToContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${contactId}/applied_tags`,
        ...opts,
      });
    },
    getContact({ contactId }) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
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
    listTags({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/contacts/tags`,
        ...opts,
      });
    },
    listTeams(opts = {}) {
      return this._makeRequest({
        path: "/teams",
        ...opts,
      });
    },
    listWorkspaces({
      teamId, ...opts
    }) {
      return this._makeRequest({
        path: `/teams/${teamId}/workspaces`,
        ...opts,
      });
    },
    removeTagFromContact({
      contactId, tagId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/contacts/${contactId}/applied_tags/${tagId}`,
      });
    },
    updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    upsertContact({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/contacts/upsert`,
        ...opts,
      });
    },
    createWebhook({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/webhooks/outgoing/endpoints`,
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/outgoing/endpoints/${webhookId}`,
      });
    },
  },
};
