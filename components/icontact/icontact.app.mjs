import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "icontact",
  propDefinitions: {
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the contact",
    },
    contactInfo: {
      type: "object",
      label: "Contact Information",
      description: "Additional information for the contact",
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list",
      async options() {
        const lists = await this.getLists();
        return lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
    senderEmail: {
      type: "string",
      label: "Sender Email",
      description: "The email of the sender",
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "The email of the recipient",
    },
    htmlContent: {
      type: "string",
      label: "HTML Content",
      description: "The HTML content for the message",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the message",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.icontact.com/v2.0";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers = {},
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async getLists(opts = {}) {
      return this._makeRequest({
        path: "/lists",
        ...opts,
      });
    },
    async createContact({
      contactEmail, contactInfo, firstName, lastName, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: {
          email: contactEmail,
          firstName,
          lastName,
          ...contactInfo,
        },
        ...opts,
      });
    },
    async updateContact({
      contactId, contactInfo, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        data: contactInfo,
        ...opts,
      });
    },
    async subscribeContactToList({
      contactEmail, listId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/lists/${listId}/contacts`,
        data: {
          email: contactEmail,
        },
        ...opts,
      });
    },
    async createAndSendMessage({
      recipientEmail,
      senderEmail,
      htmlContent,
      subject,
      ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        data: {
          recipient: recipientEmail,
          sender: senderEmail,
          message: {
            body: htmlContent,
            subject,
          },
        },
        ...opts,
      });
    },
  },
  hooks: {
    async contactCreated() {
      // Emit a new event when a contact is created.
    },
    async contactUpdated() {
      // Emit a new event when a contact is updated.
    },
    async contactSubscribed() {
      // Emit a new event when a contact is subscribed to a list.
    },
  },
};
