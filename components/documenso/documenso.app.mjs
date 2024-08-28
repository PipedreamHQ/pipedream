import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "documenso",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the pre-existing template",
    },
    documentSettings: {
      type: "object",
      label: "Document Settings",
      description: "The settings for the new document",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "The metadata for the new document",
      optional: true,
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document",
    },
    recipientDetails: {
      type: "object",
      label: "Recipient Details",
      description: "The details of the recipient",
    },
    emailContent: {
      type: "string",
      label: "Email Content",
      description: "The content of the email",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to the recipient",
      optional: true,
    },
    notificationSettings: {
      type: "object",
      label: "Notification Settings",
      description: "The notification settings for the recipient",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.documenso.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createDocumentFromTemplate({
      templateId, documentSettings, metadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/documents",
        data: {
          template_id: templateId,
          settings: documentSettings,
          metadata: metadata,
        },
      });
    },
    async sendDocumentForSigning({
      documentId, recipientDetails, emailContent,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/${documentId}/send`,
        data: {
          recipients: recipientDetails,
          email_content: emailContent,
        },
      });
    },
    async addRecipientToDocument({
      documentId, recipientDetails, message, notificationSettings,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/${documentId}/recipients`,
        data: {
          recipient: recipientDetails,
          message: message,
          notification_settings: notificationSettings,
        },
      });
    },
  },
};
