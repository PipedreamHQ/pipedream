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
    tagId: {
      label: "Tag",
      description: "The tag that will be added",
      type: "any",
      async options({ page }) {
        const { tags } = await this.listTags({
          params: {
            page: page + 1,
          },
        });

        return tags.map(({
          name, id,
        }) => ({
          label: name,
          value: JSON.stringify({
            id,
            name,
          }),
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
    async listTags({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "tags",
        params,
      });
    },
    async addTagToContact({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "tags",
        data,
      });
    },
  },
};
