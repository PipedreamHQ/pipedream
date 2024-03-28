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
    _baseUrl() {
      return "https://api.autobound.ai/api/external";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "X-API-KEY": `${this.$auth.api_key}`,
        },
      });
    },
    async generateContent(args) {
      return this._makeRequest({
        url: "/generate-content/v3.1",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
  },
};
