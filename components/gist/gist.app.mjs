import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gist",
  propDefinitions: {
    contactId: {
      label: "Contact Id",
      description: "The Id of the contact that will be retrieved",
      type: "integer",
      async options({ page }) {
        const { contacts } = await this.listContacts({
          params: {
            page: page + 1,
            per_page: 2,
          },
        });

        return contacts.map(({
          name, email, id,
        }) => ({
          label: `${name} - ${email}`,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.getgist.com";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $, path, ...otherConfig
    }) {
      const config = {
        url: `${this._getBaseUrl()}/${path}`,
        headers: this._getHeaders(),
        ...otherConfig,
      };

      console.log("config: ", config);

      return axios($ || this, config);
    },
    async listContacts({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "contacts",
        params,
      });
    },
    async getContact({
      $, contactId,
    }) {
      return this._makeRequest({
        $,
        path: `contacts/${contactId}`,
      });
    },
  },
};
