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
        const numbers = await this.getNumbers();
        return numbers.map((number) => ({
          label: number,
          value: number,
        }));
      },
    },
    toNumber: {
      type: "string",
      label: "To Number",
      description: "The number to which the SMS/MMS is sent",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the SMS/MMS",
    },
    medias: {
      type: "string[]",
      label: "Medias",
      description: "The media URLs for the MMS",
    },
    contactIds: {
      type: "string[]",
      label: "Contact IDs",
      description: "The IDs of the contacts to delete",
      async options() {
        const contacts = await this.getContacts();
        return contacts.map((contact) => ({
          label: contact.name,
          value: contact.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.krispcall.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getNumbers() {
      return this._makeRequest({
        path: "/numbers",
      });
    },
    async getContacts() {
      return this._makeRequest({
        path: "/contacts",
      });
    },
    async createContact(opts = {}) {
      const {
        number, name, email, company, address,
      } = opts;
      const response = await this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: {
          number,
          name,
          email,
          company,
          address,
        },
      });
      this.emitNewContact();
      return response;
    },
    async sendSMS(opts = {}) {
      const {
        fromNumber, toNumber, content,
      } = opts;
      const response = await this._makeRequest({
        method: "POST",
        path: "/sms",
        data: {
          fromNumber,
          toNumber,
          content,
        },
      });
      this.emitNewSMSorMMS();
      return response;
    },
    async sendMMS(opts = {}) {
      const {
        fromNumber, toNumber, content, medias,
      } = opts;
      const response = await this._makeRequest({
        method: "POST",
        path: "/mms",
        data: {
          fromNumber,
          toNumber,
          content,
          medias,
        },
      });
      this.emitNewSMSorMMS();
      return response;
    },
    async deleteContacts(opts = {}) {
      const { contactIds } = opts;
      return this._makeRequest({
        method: "DELETE",
        path: "/contacts",
        data: {
          contactIds,
        },
      });
    },
    emitNewContact() {
      this.$emit("new_contact", {
        summary: "New Contact Created",
        ts: Date.now(),
      });
    },
    emitNewSMSorMMS() {
      this.$emit("new_sms_or_mms", {
        summary: "New SMS or MMS Sent",
        ts: Date.now(),
      });
    },
    emitNewVoicemail() {
      this.$emit("new_voicemail", {
        summary: "New Voicemail Sent",
        ts: Date.now(),
      });
    },
  },
};
