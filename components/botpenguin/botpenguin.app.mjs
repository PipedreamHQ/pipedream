import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "botpenguin",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The identifier of the chat session.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The text of the message you wish to send.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The full name of the contact.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact.",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact.",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The identifier for the contact.",
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: "A dictionary of attribute names and values.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.v7.botpenguin.com";
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
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async sendMessage({
      sessionId, content,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/inbox/messages/send",
        data: {
          session_id: sessionId,
          content,
        },
      });
    },
    async addContact({
      name, email, phone,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/inbox/users/import",
        data: {
          profile: {
            userDetails: {
              userProvidedName: name,
              contact: {
                email,
                phone: phone
                  ? {
                    number: phone,
                  }
                  : undefined,
              },
            },
          },
        },
      });
    },
    async updateContactAttributes({
      contactId, attributes,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${contactId}/attributes`,
        data: {
          attributes,
        },
      });
    },
  },
};
