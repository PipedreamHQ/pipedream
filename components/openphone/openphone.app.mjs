import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "openphone",
  propDefinitions: {
    resourceIds: {
      type: "string[]",
      label: "Resource IDs",
      description: "The unique identifiers of phone numbers associated with the webhook.",
      optional: true,
      async options() {
        const phoneNumbers = await this.listPhoneNumbers();
        return phoneNumbers.map((phone) => ({
          label: phone.formattedNumber,
          value: phone.id,
        }));
      },
    },
    label: {
      type: "string",
      label: "Label",
      description: "Webhook's label",
      optional: true,
    },
    from: {
      type: "string",
      label: "From",
      description: "The sender's phone number. Can be either your OpenPhone phone number ID or the full phone number in E.164 format.",
      async options() {
        const phoneNumbers = await this.listPhoneNumbers();
        return phoneNumbers.map((phone) => ({
          label: phone.formattedNumber,
          value: phone.id,
        }));
      },
    },
    to: {
      type: "string[]",
      label: "To",
      description: "Array of recipient phone numbers in E.164 format. Currently only supports one recipient.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The text content of the message to be sent.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier of the OpenPhone user sending the message.",
      optional: true,
    },
    setInboxStatus: {
      type: "string",
      label: "Inbox Status",
      description: "Set the status of the related OpenPhone inbox conversation.",
      optional: true,
      options: [
        {
          label: "Done",
          value: "done",
        },
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The contact's company name.",
      optional: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "The contact's role.",
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Array of contact's emails.",
      optional: true,
    },
    phoneNumbers: {
      type: "string[]",
      label: "Phone Numbers",
      description: "Array of contact's phone numbers.",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Array of custom fields for the contact.",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier of the contact.",
    },
    recording: {
      type: "boolean",
      label: "Voicemail Recording",
      description: "Include voicemail recording in the response.",
    },
    transcription: {
      type: "boolean",
      label: "Voicemail Transcription",
      description: "Include voicemail transcription in the response.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.openphone.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
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
    async listPhoneNumbers(opts = {}) {
      return this._makeRequest({
        path: "/v1/phone-numbers",
        ...opts,
      });
    },
    async createWebhook(data) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/webhooks/calls",
        data,
      });
    },
    async sendTextMessage(data) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/messages",
        data: {
          from: this.from,
          to: this.to,
          content: this.content,
          userId: this.userId,
          setInboxStatus: this.setInboxStatus,
        },
      });
    },
    async createContact(data) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/contacts",
        data: {
          firstName: this.firstName,
          lastName: this.lastName,
          company: this.company,
          role: this.role,
          emails: this.emails,
          phoneNumbers: this.phoneNumbers,
          customFields: this.customFields,
        },
      });
    },
    async updateContact(contactId, data) {
      return this._makeRequest({
        method: "PATCH",
        path: `/v1/contacts/${contactId}`,
        data: {
          firstName: this.firstName,
          lastName: this.lastName,
          company: this.company,
          role: this.role,
          emails: this.emails,
          phoneNumbers: this.phoneNumbers,
          customFields: this.customFields,
        },
      });
    },
  },
};
