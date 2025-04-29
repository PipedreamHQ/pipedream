import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smstools",
  propDefinitions: {
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The group ID where the contact should be added.",
      async options({ page }) {
        const groups = await this.getGroups({
          params: {
            page: page + 1,
          },
        });
        return groups.map(({
          ID: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactNumber: {
      type: "string",
      label: "Contact Number",
      description: "Select a contact number to add to the opt-out list.",
      async options({ page }) {
        const { contacts } = await this.getContactNumbers({
          params: {
            page: page + 1,
          },
        });
        return contacts.map(({ phone }) => phone);
      },
    },
    sender: {
      type: "string",
      label: "Sender",
      description: "The sender ID for the message.",
      async options() {
        const senders = await this.getSenderIds();
        return senders.map(({
          ID: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    subId: {
      type: "string",
      label: "Sub ID",
      description: "Subaccount ID from which the message is sent.",
      async options() {
        const subaccounts = await this.getSubAccounts();
        return subaccounts.map(({
          ID: value, username: label,
        }) => ({
          label,
          value,
        }));
      },
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.smsgatewayapi.com/v1";
    },
    _params(params = {}) {
      return {
        client_id: `${this.$auth.client_id}`,
        client_secret: `${this.$auth.client_secret}`,
        ...params,
      };
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        params: this._params(params),
        ...opts,
      });
    },
    getInboxMessages(opts = {}) {
      return this._makeRequest({
        path: "/message/inbox",
        ...opts,
      });
    },
    getContactNumbers(opts = {}) {
      return this._makeRequest({
        path: "/contact",
        ...opts,
      });
    },
    getGroups(opts = {}) {
      return this._makeRequest({
        path: "/groups",
        ...opts,
      });
    },
    getSenderIds(opts = {}) {
      return this._makeRequest({
        path: "/senderids",
        ...opts,
      });
    },
    getSubAccounts(opts = {}) {
      return this._makeRequest({
        path: "/subaccount",
        ...opts,
      });
    },
    addContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contact",
        ...opts,
      });
    },
    addOptOut(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/optouts",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/message/send",
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
        const { messages } = await fn({
          params,
          ...opts,
        });
        for (const d of messages) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = messages.length;

      } while (hasMore);
    },
  },
};
