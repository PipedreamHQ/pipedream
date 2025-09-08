import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lawmatics",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      async options({ page }) {
        const { data } = await this.listContacts({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, attributes: { email },
        }) => ({
          value,
          label: email,
        }));
      },
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
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact",
      optional: true,
    },
    notes: {
      type: "string[]",
      label: "Notes",
      description: "An array of notes for the contact. Each note is an object with properties `name` and `body`. Example: `[{ name: 'Note 1', body: 'This is a note' }, { name: 'Note 2', body: 'This is another note' }]`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lawmatics.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "post",
        ...opts,
      });
    },
    updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        method: "put",
        ...opts,
      });
    },
    async *paginate({
      fn, params, max,
    }) {
      params = {
        ...params,
        page: 1,
      };
      let totalPages, count = 0;
      do {
        const { data } = await fn({
          params,
        });
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        totalPages = data?.meta?.total_pages;
        params.page++;
      } while (params.page <= totalPages);
    },
  },
};
