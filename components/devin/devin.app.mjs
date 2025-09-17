import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "devin",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The ID of a session",
      async options({ page }) {
        const { sessions } = await this.listSessions({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return sessions?.map(({
          session_id: value, title: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    knowledgeId: {
      type: "string",
      label: "Knowledge ID",
      description: "The ID of a knowledge object",
      async options() {
        const { knowledge } = await this.listKnowledge();
        return knowledge?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of a folder",
      async options() {
        const { folders } = await this.listKnowledge();
        return folders?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    secretIds: {
      type: "string[]",
      label: "Secret IDs",
      description: "The IDs of the secrets to use",
      async options() {
        const secrets = await this.listSecrets();
        return secrets?.map(({
          id: value, key: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    body: {
      type: "string",
      label: "Body",
      description: "The content of the knowledge. Devin will read this when the knowledge gets triggered",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the knowledge, used only for displaying the knowledge on the knowledge page",
    },
    triggerDescription: {
      type: "string",
      label: "Trigger Description",
      description: "The description of when this knowledge should be used by Devin",
    },
    pinnedRepo: {
      type: "string",
      label: "Pinned Repo",
      description: "Pin knowledge to specific repositories. Valid values: `null`: No pinning (default), `all`: Pin to all repositories, `owner/repo`: Pin to specific repository, `owner/repo`: Pin to specific repository",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.devin.ai/v1";
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    getSession({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        path: `/sessions/${sessionId}`,
        ...opts,
      });
    },
    listSessions(opts = {}) {
      return this._makeRequest({
        path: "/sessions",
        ...opts,
      });
    },
    listKnowledge(opts = {}) {
      return this._makeRequest({
        path: "/knowledge",
        ...opts,
      });
    },
    listSecrets(opts = {}) {
      return this._makeRequest({
        path: "/secrets",
        ...opts,
      });
    },
    createSession(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sessions",
        ...opts,
      });
    },
    sendMessageToSession({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sessions/${sessionId}/message`,
        ...opts,
      });
    },
    uploadFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/attachments",
        ...opts,
      });
    },
    updateSessionTags({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/sessions/${sessionId}/tags`,
        ...opts,
      });
    },
    createKnowledge(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/knowledge",
        ...opts,
      });
    },
    updateKnowledge({
      knowledgeId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/knowledge/${knowledgeId}`,
        ...opts,
      });
    },
    deleteKnowledge({ knowledgeId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/knowledge/${knowledgeId}`,
      });
    },
  },
};
