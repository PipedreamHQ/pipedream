import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mailgenius",
  propDefinitions: {
    slug: {
      type: "string",
      label: "Model",
      description: "Specifies the model to be used for the request",
      async options() {
        const response = await this.getEmails();
        const emailsSlugs = response.test_emails;
        return emailsSlugs.map(({
          slug, test_email,
        }) => ({
          value: slug,
          label: test_email,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.mailgenius.com";
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
          Authorization: `Bearer ${this.$auth.api_token}`,
          accept: "*/*",
        },
      });
    },
    async emailAudit(args = {}) {
      return this._makeRequest({
        path: "/external/api/email-audit",
        ...args,
      });
    },
    async emailResult({
      slug, ...args
    }) {
      return this._makeRequest({
        path: `/external/api/email-result/${slug}`,
        ...args,
      });
    },
    async getDailyLimit(args = {}) {
      return this._makeRequest({
        path: "/external/api/daily_limit",
        ...args,
      });
    },
    async getEmails(args = {}) {
      return this._makeRequest({
        path: "/external/api/audits",
        ...args,
      });
    },
  },
};
