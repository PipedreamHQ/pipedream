import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dust",
  propDefinitions: {
    content: {
      type: "string",
      label: "Message Content",
      description: "The content of the message to be sent to the assistant",
    },
    document: {
      type: "string",
      label: "Document",
      description: "The content of the document to be uploaded",
    },
    destination: {
      type: "string",
      label: "Destination",
      description: "The destination data source or folder where the document will be uploaded",
      async options() {
        const dataSources = await this.listDataSources();
        return dataSources.map((dataSource) => ({
          label: dataSource.name,
          value: dataSource.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://dust.tt/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;

      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listDataSources(opts = {}) {
      return this._makeRequest({
        path: `/w/${this.$auth.workspace_id}/data_sources`,
        ...opts,
      });
    },
    async sendMessageToAssistant({
      content, assistantId, conversationId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/w/${this.$auth.workspace_id}/assistant/conversations/${conversationId}/messages`,
        data: {
          content,
          assistantId,
        },
      });
    },
    async upsertDocument({
      document, destination,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/w/${this.$auth.workspace_id}/data_sources/${destination}/documents/${document.documentId}`,
        data: {
          text: document,
        },
      });
    },
  },
};
