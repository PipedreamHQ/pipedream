import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "retently",
  propDefinitions: {
    responseId: {
      type: "string",
      label: "Response",
      description: "Customer response to add tags to",
      async options({ page }) {
        const params = {
          page: page + 1,
        };
        const { data: { responses } } = await this.listFeedback({
          params,
        });
        if (!responses?.length) {
          return [];
        }
        return responses.map(({
          id: value, email, campaignName,
        }) => ({
          value,
          label: `${email} - ${campaignName}`,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to add to the new customer",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.retently.com/api/v2";
    },
    _headers() {
      return {
        Authorization: `api_key=${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listFeedback(args = {}) {
      return this._makeRequest({
        path: "/feedback",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        path: "/nps/customers",
        ...args,
      });
    },
    createCustomer(args = {}) {
      return this._makeRequest({
        path: "/nps/customers",
        method: "POST",
        ...args,
      });
    },
    addFeedbackTags(args = {}) {
      return this._makeRequest({
        path: "/response/tags",
        method: "POST",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, resultField,
    }) {
      params = {
        ...params,
        limit: 100,
        page: 1,
      };
      let total = 0;

      do {
        const { data } = await fn({
          params,
        });
        const items = resultField
          ? data[resultField]
          : data;
        for (const d of items) {
          yield d;
        }
        total = items?.length;
      } while (total === params.limit);
    },
  },
};
