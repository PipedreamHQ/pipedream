import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "yespo",
  propDefinitions: {
    segment: {
      type: "string",
      label: "Segment",
      description: "The name of the segment.",
      async options() {
        const response = await this.getSegments();
        return response.map((segment) => ({
          label: segment.name,
          value: segment.id,
        }));
      },
    },
    channels: {
      type: "string[]",
      label: "Channels",
      description: "Channels for the contact",
    },
    eventtypekey: {
      type: "string",
      label: "Event Type Key",
      description: "The event type key.",
    },
    recipientEmail: {
      type: "string",
      label: "Recipient's Email Address",
      description: "The email address of the message recipient.",
    },
    messageSubject: {
      type: "string",
      label: "Message Subject",
      description: "The subject of the message.",
    },
    messageBody: {
      type: "string",
      label: "Message Body",
      description: "The body of the message.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.yespo.io/api/";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json; charset=UTF-8",
        },
      });
    },
    async getSegments() {
      return this._makeRequest({
        path: "segments",
      });
    },
    async addOrUpdateContact({
      channels, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "contact",
        data: {
          channels: channels.map((channel) => JSON.parse(channel)),
          ...opts,
        },
      });
    },
    async sendEmail({
      recipientEmail, messageSubject, messageBody, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "message/email",
        data: {
          emails: [
            recipientEmail,
          ],
          subject: messageSubject,
          htmlText: messageBody,
          ...opts,
        },
      });
    },
    async registerEvent({
      eventtypekey, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "event",
        data: {
          eventTypeKey: eventtypekey,
          ...opts,
        },
      });
    },
  },
};
