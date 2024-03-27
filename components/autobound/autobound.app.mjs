import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "autobound",
  propDefinitions: {
    recipientDetails: {
      type: "object",
      label: "Recipient Details",
      description: "Contains personal information of the individual recipient.",
      properties: {
        email: {
          type: "string",
          label: "Email",
          description: "The email address of the recipient.",
        },
      },
    },
    messageTemplate: {
      type: "string",
      label: "Message Template",
      description: "The content template for setting a customized message.",
      optional: true,
    },
    customizationFields: {
      type: "object",
      label: "Customization Fields",
      description: "Additional fields for personalizing the content.",
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The type of content you want to generate.",
      options: [
        {
          label: "Email",
          value: "email",
        },
        {
          label: "Opener",
          value: "opener",
        },
        {
          label: "Connection Request",
          value: "connectionRequest",
        },
        {
          label: "SMS",
          value: "sms",
        },
        {
          label: "Call Script",
          value: "callScript",
        },
        {
          label: "Custom",
          value: "custom",
        },
      ],
    },
    customContentType: {
      type: "string",
      label: "Custom Content Type",
      description: "Write out your own desired output for custom content type.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Specifies the desired language for content generation.",
      optional: true,
      default: "english",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://autobound-api.readme.io/docs";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async generateContent({
      recipientDetails,
      messageTemplate,
      customizationFields,
      contentType,
      customContentType,
      language,
    }) {
      const data = {
        contactEmail: recipientDetails.email,
        userEmail: this.$auth.user_email,
        contentType,
        customContentType,
        language,
      };

      if (messageTemplate) {
        data.messageTemplate = messageTemplate;
      }

      if (customizationFields) {
        data.customizationFields = customizationFields;
      }

      return this._makeRequest({
        method: "POST",
        path: "/v3/content/generate",
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
    },
  },
  version: "0.0.1",
};
