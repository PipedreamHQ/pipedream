import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "stripo",
  propDefinitions: {
    emailId: {
      type: "string",
      label: "Email ID",
      description: "The identifier of an email",
      async options({ page }) {
        const { data } = await this.listEmails({
          params: {
            page,
          },
        });
        return data?.map(({
          emailId: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://my.stripo.email/emailgeneration/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Stripo-Api-Auth": this.$auth.api_key,
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    listEmails(opts = {}) {
      return this._makeRequest({
        path: "/emails",
        ...opts,
      });
    },
    getRawHtml({
      emailId, ...opts
    }) {
      return this._makeRequest({
        path: `/raw-email/${emailId}`,
        ...opts,
      });
    },
    removeEmail({
      emailId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/emails/${emailId}`,
        ...opts,
      });
    },
    async *paginate({
      fn, params, max,
    }) {
      params = {
        ...params,
        page: 0,
      };
      let totalResults, count = 0;
      do {
        const {
          data, total,
        } = await fn({
          params,
        });
        totalResults = total;
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
      } while (count < totalResults);
    },
  },
};
