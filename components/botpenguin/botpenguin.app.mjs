import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "botpenguin",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The identifier for the contact.",
      async options({ page }) {
        const { data } = await this.listContacts({
          data: {
            page: page + 1,
          },
        });

        return data.map(({
          _id: value, profile: {
            userDetails: {
              name, contact: {
                email, phone,
              },
            },
          },
        }) => ({
          label: `${name || email || `${phone.prefix} ${phone.number}`}`,
          value,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The full name of the contact.",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact.",
    },
    prefix: {
      type: "string",
      label: "Prefix",
      description: "The prefix of the phone number.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.v7.botpenguin.com";
    },
    _headers(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.access_token}`,
        "authtype": "Key",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers = {}, ...opts
    }) {
      const config = {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      };

      return axios($, config);
    },
    addContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/inbox/users/import",
        ...opts,
      });
    },
    async getContact({ contactId }) {
      const responseArray = this.paginate({
        fn: this.listContacts,

      });
      for await (const item of responseArray) {
        if (item._id === contactId) return item;
      }
    },
    listContacts({
      opts, data,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/inbox/users",
        data: {
          searchText: "",
          applicableFilters: [],
          createdAt: {
            startAt: "",
            endsAt: "",
          },
          lastSeenAt: {
            startAt: "",
            endsAt: "",
          },
          _botWebsite: [],
          _botWhatsapp: [],
          _botTelegram: [],
          _botFacebook: [],
          status: [],
          lastMessageBy: [],
          tags: [],
          _agentAssigned: [],
          isExport: "none",
          ...data,
        },
        ...opts,

      });
    },
    updateContact({
      contactId, ...data
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/inbox/users/${contactId}`,
        ...data,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/whatsapp-automation/wa/send-message",
        ...opts,
      });
    },
    async *paginate({
      fn, data = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        data.page = ++page;
        const { data: response } = await fn({
          data,
          ...opts,
        });

        for (const d of response) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = response.length;

      } while (hasMore);
    },
  },
};
