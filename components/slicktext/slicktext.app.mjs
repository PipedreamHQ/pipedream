import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "slicktext",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact to be updated",
    },
    contactNumber: {
      type: "string",
      label: "Contact Number",
      description: "The phone number of the contact. Must be at least 10 digits.",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The body of the text message you want to send.",
    },
    textwordId: {
      type: "string",
      label: "Textword ID",
      description: "The ID of the textword",
      async options() {
        const response = await this._makeRequest({
          path: "/textwords",
        });
        return response.textwords.map((textword) => ({
          label: textword.word,
          value: textword.id,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address of the contact",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the contact",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the contact",
      optional: true,
    },
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "The zip code of the contact",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the contact",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.slicktext.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    async updateContact(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        data: {
          action: "EDIT",
          contactId: opts.contactId,
          name: opts.name,
          emailAddress: opts.emailAddress,
          city: opts.city,
          state: opts.state,
          zipCode: opts.zipCode,
          country: opts.country,
        },
      });
    },
    async sendMessage(opts = {}) {
      return this._makeRequest({
        path: "/messages",
        data: {
          action: "SEND",
          contactNumber: opts.contactNumber,
          messageContent: opts.messageContent,
          textwordId: opts.textwordId,
        },
      });
    },
    async addContact(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        data: {
          action: "DOUBLEOPTIN",
          contactNumber: opts.contactNumber,
        },
      });
    },
  },
};
