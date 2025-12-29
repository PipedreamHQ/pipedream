import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "easybroker",
  propDefinitions: {
    propertyId: {
      type: "string",
      label: "Property ID",
      description: "The ID of the property to get",
      async options({ page }) {
        const { content } = await this.listProperties({
          params: {
            page: page + 1,
          },
        });
        return content?.map(({
          public_id: value, title: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact to get",
      async options({ page }) {
        const { content } = await this.listContacts({
          params: {
            page: page + 1,
          },
        });
        return content?.map(({
          id: value, full_name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.easybroker.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-authorization": `${this.$auth.api_key}`,
          "Accept": "application/json",
        },
        ...opts,
      });
    },
    getProperty({
      propertyId, ...opts
    }) {
      return this._makeRequest({
        path: `/properties/${propertyId}`,
        ...opts,
      });
    },
    getContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    listProperties(opts = {}) {
      return this._makeRequest({
        path: "/properties",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listContactRequests(opts = {}) {
      return this._makeRequest({
        path: "/contact_requests",
        ...opts,
      });
    },
    createContactRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contact_requests",
        ...opts,
      });
    },
  },
};
