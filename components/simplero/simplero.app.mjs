import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "simplero",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list",
      async options() {
        const lists = await this.getLists();

        return lists.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
    },
    ipAddress: {
      type: "string",
      label: "IP Address",
      description: "The IP address of the contact",
    },
    referrer: {
      type: "string",
      label: "Referrer",
      description: "The referrer URL",
    },
    ref: {
      type: "integer",
      label: "Ref",
      description: "The ref of the contact",
    },
    landingPageId: {
      type: "integer",
      label: "Landing Page ID",
      description: "The landing page ID to track the contact from",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tags to add to the contact",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Sanitized phone number with country code first, e.g. '15551231234'",
    },
    gdprConsent: {
      type: "boolean",
      label: "GDPR Consent",
      description: "Whether the contact has given GDPR consent",
    },
  },
  methods: {
    _baseUrl() {
      return "https://simplero.com/api/v1";
    },
    _getHeaders() {
      return {
        "User-Agent": `${this.$auth.application_info}`,
      };
    },
    _getAuth() {
      return {
        username: this.$auth.api_key,
        password: "",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._getHeaders(),
        auth: this._getAuth(),
        ...opts,
      });
    },
    createOrUpdateContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers.json",
        ...opts,
      });
    },
    addTagToContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers/add_tag.json",
        ...opts,
      });
    },
    getLists(opts = {}) {
      return this._makeRequest({
        path: "/lists.json",
        ...opts,
      });
    },
    subscribeToList({
      listId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/lists/${listId}/subscribe.json`,
        ...opts,
      });
    },
    getProducts(opts = {}) {
      return this._makeRequest({
        path: "/products.json",
        ...opts,
      });
    },
    getInvoices(opts = {}) {
      return this._makeRequest({
        path: "/invoices.json",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
