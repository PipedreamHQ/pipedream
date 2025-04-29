import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "krispcall",
  propDefinitions: {
    number: {
      type: "string",
      label: "Number",
      description: "The phone number of the contact",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the contact",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the contact",
      optional: true,
    },
    fromNumber: {
      type: "string",
      label: "From Number",
      description: "The number from which the SMS/MMS is sent",
      async options() {
        const numbers = await this.listNumbers();
        return numbers.map(({ number }) => number);
      },
    },
    toNumber: {
      type: "string",
      label: "To Number",
      description: "The recipient's phone number",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the SMS/MMS",
    },
    medias: {
      type: "string[]",
      label: "Medias",
      description: "The media files for MMS. It should be a valid url field and size should not be greater than 5mb. Upto 5 media lists are supported. Media url should be starting from https. Media url should be public accessible and content-type should be supported by KrispCall app.",
    },
    contactIds: {
      type: "string[]",
      label: "Contact Numbers",
      description: "The phone numbers of the contacts to delete",
      async options() {
        const contacts = await this.listContacts();
        return contacts.map(({
          name, contact_number: number,
        }) => ({
          label: `${name} ${number}`,
          value: number,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      // Base URL for Production
      // return https://automationapi.krispcall.com/api/v1/platform/pipedream

      // Base URL for Development
      return "https://automationqaapi.safefamilyapp.com/api/v1/platform/pipedream";
    },
    _headers() {
      return {
        "X-API-Key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listNumbers() {
      return this._makeRequest({
        path: "/get-numbers",
      });
    },
    listContacts() {
      return this._makeRequest({
        path: "/get-contacts",
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/add-contact",
        ...opts,
      });
    },
    sendSMS(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/send-sms",
        ...opts,
      });
    },
    sendMMS(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/send-mms",
        ...opts,
      });
    },
    deleteContacts(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/delete-contacts",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscribe",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/unsubscribe",
        ...opts,
      });
    },
  },
};
