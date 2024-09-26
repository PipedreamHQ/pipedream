import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bot9",
  propDefinitions: {
    chatbotId: {
      type: "string",
      label: "Chatbot ID",
      description: "The unique identifier for your Bot9 chatbot.",
      async options() {
        const {
          chatbot: {
            id: value,
            name: label,
          },
        } = await this.getAccount();

        return [
          {
            label,
            value,
          },
        ];
      },
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source from where the chat is initiated (e.g., WhatsApp, Facebook, etc.).",
      options: [
        {
          label: "WhatsApp",
          value: "whatsapp",
        },
        {
          label: "Intercom",
          value: "intercom",
        },
        {
          label: "Slack",
          value: "slack",
        },
        {
          label: "Crisp",
          value: "crisp",
        },
        {
          label: "Zapier",
          value: "zapier",
        },
        {
          label: "Zendesk",
          value: "zendesk",
        },
        {
          label: "Zoko",
          value: "zoko",
        },
        {
          label: "Freshdesk",
          value: "freshdesk",
        },
        {
          label: "Website Widget",
          value: "website-widget",
        },
        {
          label: "Debugger",
          value: "debugger",
        },
        {
          label: "Discord",
          value: "discord",
        },
        {
          label: "Stripe",
          value: "stripe",
        },
        {
          label: "Meta Messenger",
          value: "meta-messenger",
        },
        {
          label: "Other",
          value: "other",
        },
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the chat. The only valid value currently is `active`.",
      options: [
        {
          label: "Active",
          value: "active",
        },
      ],
    },
    externalSessionId: {
      type: "string",
      label: "External Session ID",
      description: "An ID you want to reference from an external system, such as your own database.",
      optional: true,
    },
    userName: {
      type: "string",
      label: "User Name",
      description: "The name of the user. If it does not exist, a randomly generated user is used.",
      optional: true,
    },
    userExternalId: {
      type: "string",
      label: "User External ID",
      description: "An ID you want to reference from an external system, such as your own database user ID.",
      optional: true,
    },
    userEmailId: {
      type: "string",
      label: "User Email",
      description: "The email ID of the user.",
      optional: true,
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The unique identifier for the conversation.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The chat message to send to the bot.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://apiv1.bot9.ai/api";
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    getAccount(args = {}) {
      return this._makeRequest({
        path: "/auth/account",
        ...args,
      });
    },
  },
};
