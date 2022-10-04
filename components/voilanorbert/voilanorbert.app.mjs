import { axios } from "@pipedream/platform";
import { objectToString } from "./utils.mjs";

export default {
  type: "app",
  app: "voilanorbert",
  propDefinitions: {
    contactId: {
      type: "integer",
      label: "Contact Id",
      description: "The contact's id.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Full name of the person to search.",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the company. (Either `domain` or `company` is required).",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The name of the company. (Either `domain` or `company` is required).",
    },
    emails: {
      type: "string",
      label: "Emails",
      description: "Comma separated emails",
    },
    listId: {
      type: "integer",
      label: "List ID",
      description: "A List ID the contact will affected to.",
      async options() {
        const { result } = await this.getLists();

        return result.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.api_key;
    },
    _auth() {
      return {
        username: "",
        password: this._accessToken(),
      };
    },
    _apiUrl() {
      return "https://api.voilanorbert.com/2018-01-08";
    },
    async _makeRequest({
      $ = this, path, ...options
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        ...options,
        auth: this._auth(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      return axios($, config);
    },
    async getContact({ contactId }) {
      return await this._makeRequest({
        path: `contacts/${contactId}`,
      });
    },
    async getLists() {
      return await this._makeRequest({
        path: "lists/",
      });
    },
    async startContactSearch(data) {
      const bodyFormData = objectToString(data);
      return await this._makeRequest({
        method: "POST",
        path: "search/name",
        data: bodyFormData,
      });
    },
    async verifyEmails(data) {
      const bodyFormData = objectToString(data);
      return await this._makeRequest({
        method: "POST",
        path: "verifier/upload",
        data: bodyFormData,
      });
    },
  },
};
