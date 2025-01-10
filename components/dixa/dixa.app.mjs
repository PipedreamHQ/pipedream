import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dixa",
  version: "0.0.{{ts}}",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name of the event",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the conversation",
    },
    emailIntegrationId: {
      type: "string",
      label: "Email Integration ID",
      description: "The ID of the email integration",
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The type of the message",
      options: [
        {
          label: "Inbound",
          value: "inbound",
        },
        {
          label: "Outbound",
          value: "outbound",
        },
      ],
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language of the conversation",
      optional: true,
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of the conversation",
      async options() {
        const conversations = await this.listConversations();
        return conversations.map((conv) => ({
          label: conv.name || `Conversation ${conv.id}`,
          value: conv.id,
        }));
      },
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "List of files to include in the message",
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content of the message",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "External ID of the message",
      optional: true,
    },
    integrationEmail: {
      type: "string",
      label: "Integration Email",
      description: "Email for the integration",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options() {
        const users = await this.listUsers();
        return users.map((user) => ({
          label: user.name || `User ${user.id}`,
          value: user.id,
        }));
      },
    },
    attributes: {
      type: "string",
      label: "Attributes",
      description: "Key-value pairs of attributes to update in JSON format",
      optional: true,
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The ID of the tag to add",
      async options() {
        const tags = await this.listTags();
        return tags.map((tag) => ({
          label: tag.name || `Tag ${tag.id}`,
          value: tag.id,
        }));
      },
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.dixa.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers = {}, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async listConversations(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/conversations",
        ...opts,
      });
    },
    async listUsers(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/users",
        ...opts,
      });
    },
    async listTags(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/tags",
        ...opts,
      });
    },
    async createConversation({
      subject, emailIntegrationId, messageType, language,
    }) {
      const data = {
        subject: this.subject,
        email_integration_id: this.emailIntegrationId,
        message_type: this.messageType,
      };
      if (this.language) {
        data.language = this.language;
      }
      return this._makeRequest({
        method: "POST",
        path: "/conversations",
        data,
      });
    },
    async addMessage({
      conversationId, attachments, content, externalId, integrationEmail,
    }) {
      const data = {};
      if (this.attachments && this.attachments.length > 0) {
        data.attachments = this.attachments.map((file) => ({
          file,
        }));
      }
      if (this.content) {
        data.content = this.content;
      }
      if (this.externalId) {
        data.external_id = this.externalId;
      }
      if (this.integrationEmail) {
        data.integration_email = this.integrationEmail;
      }
      return this._makeRequest({
        method: "POST",
        path: `/conversations/${this.conversationId}/messages`,
        data,
      });
    },
    async updateCustomAttributes({
      userId, attributes,
    }) {
      let parsedAttributes = {};
      if (this.attributes) {
        try {
          parsedAttributes = JSON.parse(this.attributes);
        } catch (e) {
          throw new Error("Attributes must be a valid JSON string.");
        }
      }
      return this._makeRequest({
        method: "PUT",
        path: `/users/${this.userId}/attributes`,
        data: parsedAttributes,
      });
    },
    async addTag({
      conversationId, tagId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/conversations/${this.conversationId}/tags`,
        data: {
          tag_id: this.tagId,
        },
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let hasMore = true;
      let page = 1;
      while (hasMore) {
        const response = await fn({
          ...opts,
          page,
        });
        if (response.length === 0) {
          hasMore = false;
        } else {
          results = results.concat(response);
          page += 1;
        }
      }
      return results;
    },
  },
};
