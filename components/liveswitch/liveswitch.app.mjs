import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "liveswitch",
  propDefinitions: {
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Contact's email",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Contact's phone number, i.e.: `+1 407-982-1211`",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The contents of the text message the user will receive",
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Contact's ID",
      async options() {
        const response = await this.getContacts();
        return response.map(({
          id, firstName, lastName,
        }) => ({
          value: id,
          label: `${firstName} ${lastName}`,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://public-api.production.liveswitch.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "post",
        ...args,
      });
    },
    async updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        method: "put",
        ...args,
      });
    },
    async createConversation(args = {}) {
      return this._makeRequest({
        path: "/conversations",
        method: "post",
        ...args,
      });
    },
    async getContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        params: {
          page: 1,
          pageSize: 100,
        },
        ...args,
      });
    },
  },
};
