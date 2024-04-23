import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "infobip",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to send the SMS message to, in E.164 format.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text of the SMS or WhatsApp message to send.",
    },
    sender: {
      type: "string",
      label: "Sender",
      description: "The sender ID that the message appears to come from for SMS messages.",
      optional: true,
    },
    to: {
      type: "string[]",
      label: "Recipients",
      description: "An array of recipient phone numbers in international format for sending bulk messages.",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The type of content being sent in bulk messages.",
    },
    contentText: {
      type: "string",
      label: "Content Text",
      description: "The text content to send in bulk messages.",
    },
    from: {
      type: "string",
      label: "From",
      description: "Registered WhatsApp sender number in international format.",
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The ID that uniquely identifies the message sent via WhatsApp.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.infobip.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `App ${this.$auth.api_key}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });
    },
    async sendSms({
      phoneNumber, message, sender,
    }) {
      return this._makeRequest({
        path: "/sms/2/text/single",
        data: {
          from: sender,
          to: phoneNumber,
          text: message,
        },
      });
    },
    async sendBulkSms({
      sender, to, contentType, contentText,
    }) {
      return this._makeRequest({
        path: "/sms/2/text/advanced",
        data: {
          messages: to.map((number) => ({
            from: sender,
            destinations: [
              {
                to: number,
              },
            ],
            contentType,
            content: {
              text: contentText,
            },
          })),
        },
      });
    },
    async sendWhatsappMessage({
      from, to, message, messageId,
    }) {
      return this._makeRequest({
        path: "/whatsapp/1/message/text",
        data: {
          from,
          to,
          content: {
            text: message,
          },
          messageId,
        },
      });
    },
  },
};
