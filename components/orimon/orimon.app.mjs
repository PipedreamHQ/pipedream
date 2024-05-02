import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "orimon",
  propDefinitions: {
    text: {
      type: "string",
      label: "Message Text",
      description: "The text message you want Orimon to receive.",
    },
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Your Orimon API key.",
      secret: true,
    },
    tenantId: {
      type: "string",
      label: "Tenant ID",
      description: "The unique ID of the chat-bot you want a response from.",
    },
    platformSessionId: {
      type: "string",
      label: "Platform Session ID",
      description: "A unique identifier, ideally unique per user. Format: 'some_random_value' + '_' + tenantId.",
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "A unique identifier for every input that comes from the user.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://channel-connector.orimon.ai/orimon/v1/conversation/api/message";
    },
    async sendMessage({
      apiKey, tenantId, platformSessionId, messageId, text,
    }) {
      const data = {
        type: "message",
        info: {
          psid: platformSessionId,
          sender: "user",
          tenantId: tenantId,
          platformName: "web",
        },
        message: {
          id: messageId,
          type: "text",
          payload: {
            text: text,
          },
        },
      };

      const headers = {
        "Authorization": `apiKey ${apiKey}`,
        "Content-Type": "application/json",
      };

      return axios(this, {
        method: "POST",
        url: this._baseUrl(),
        headers: headers,
        data: data,
      });
    },
  },
  version: "0.0.1",
};
