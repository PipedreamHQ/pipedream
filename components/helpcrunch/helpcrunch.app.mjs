import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "helpcrunch",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name of the customer",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer",
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company of the user",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the user",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the user",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.helpcrunch.com/v1";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
      });
    },
    createCustomer(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        ...args,
      });
    },
    searchChats(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chats/search",
        ...args,
      });
    },
    searchCustomers(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers/search",
        ...args,
      });
    },
    async *paginate({
      resourceFn, args = {},
    }) {
      args = {
        ...args,
        data: {
          ...args.data,
          limit: 100,
          offset: 0,
        },
      };
      let total = 0;
      do {
        const { data } = await resourceFn(args);
        for (const item of data) {
          yield item;
        }
        total = data?.length;
        args.data.offset += args.data.limit;
      } while (total === args.data.limit);
    },
  },
};
