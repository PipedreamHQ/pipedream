import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sitecreator_io",
  propDefinitions: {
    siteId: {
      type: "string",
      label: "Site ID",
      description: "Identifier of a website. Present in the URL when editing your site from the [Websites List](https://admin.sitecreator.io/pages/websites/list) page.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.sitecreator.io/v1";
    },
    _headers() {
      return {
        apikey: this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      return axios($, config);
    },
    checkAvailability(args = {}) {
      return this._makeRequest({
        path: "/site/checkAvailability",
        method: "POST",
        ...args,
      });
    },
    createSite(args = {}) {
      return this._makeRequest({
        path: "/site",
        method: "POST",
        ...args,
      });
    },
    deleteSite(siteId, args = {}) {
      return this._makeRequest({
        path: `/site/deleteSite/${siteId}`,
        method: "DELETE",
        ...args,
      });
    },
    getLeads(args = {}) {
      return this._makeRequest({
        path: "/getContacts/leads",
        method: "POST",
        ...args,
      });
    },
    getNewsletter(args = {}) {
      return this._makeRequest({
        path: "/getContacts/newsletter",
        method: "POST",
        ...args,
      });
    },
  },
};
