import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "loopify",
  propDefinitions: {
    flowId: {
      type: "string",
      label: "Flow ID",
      description: "The ID of the flow",
      useQuery: true,
      async options({ query: search }) {
        const { documents } = await this.flowsSearch({
          data: {
            search,
          },
        });
        return documents.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      async options({ page }) {
        const { contacts } = await this.getContacts({
          params: {
            pageSize: 50,
            pageIndex: page + 1,
          },
        });
        return contacts.map(({
          _id: value, firstName, lastName, email,
        }) => ({
          label: `${firstName} ${lastName} ${email}`.trim() || value,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.loopify.com";
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    flowsSearch(args = {}) {
      return this.post({
        path: "/flows/search",
        ...args,
      });
    },
    getContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
  },
};
