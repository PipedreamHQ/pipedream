import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "callpage",
  propDefinitions: {
    callStatus: {
      type: "string[]",
      label: "Call Status",
      description: "Select the status of the call events to emit.",
      options: [
        {
          label: "Answered",
          value: "answered",
        },
        {
          label: "Missed",
          value: "missed",
        },
        {
          label: "Voicemail",
          value: "voicemail",
        },
        // Add additional statuses as needed
      ],
    },
    widgetId: {
      type: "string",
      label: "Widget ID",
      description: "Select the widget for the call or SMS.",
      async options() {
        const widgets = await this.getWidgets();
        return widgets.map((widget) => ({
          label: widget.description,
          value: widget.id,
        }));
      },
    },
    messageId: {
      type: "string",
      label: "Message Identifier",
      description: "Select the message identifier for the voice or SMS message.",
      async options() {
        const messages = await this.getMessages();
        return messages.map((message) => ({
          label: message.name,
          value: message.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://core.callpage.io/api";
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
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async getWidgets(opts = {}) {
      return this._makeRequest({
        path: "/v1/external/widgets/all",
        ...opts,
      });
    },
    async getMessages(opts = {}) {
      return this._makeRequest({
        path: "/v1/external/messages/all",
        ...opts,
      });
    },
    async createSMS({
      widgetId, messageId, enabled, text, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/external/sms/create",
        data: {
          widget_id: widgetId,
          message_id: messageId,
          enabled,
          text,
        },
        ...opts,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
