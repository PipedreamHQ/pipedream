import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sare",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the subscriber.",
    },
    gsm: {
      type: "string",
      label: "GSM",
      description: "The GSM number of the subscriber.",
      optional: true,
    },
    groups: {
      type: "string[]",
      label: "Groups",
      description: "The groups to remove the email subscribers from.",
      async options() {
        const { response } = await this.listGroups();

        return response.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "The email addresses of the subscribers to remove from groups.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the transactional email.",
    },
    from: {
      type: "string",
      label: "From",
      description: "The sender email address.",
    },
    newsletter: {
      type: "integer",
      label: "Newsletter",
      description: "Newsletter ID in the system.",
      async options({
        page, newsletterType,
      }) {
        const { response: { data } } = await this.listNewsletters({
          newsletterType,
          page,
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return  `https://s.enewsletter.pl/api/v1/${this.$auth.uid}`;
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "ApiKey": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    addEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/email/add",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/group/list",
        ...opts,
      });
    },
    listNewsletters({
      newsletterType, page,
    }) {
      return this._makeRequest({
        path: `/newsletter/list/${newsletterType}/${page}`,
      });
    },
    removeEmailFromGroups(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/group/remove_emails",
        ...opts,
      });
    },
    sendTransactionalEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/send/mail/transactional",
        ...opts,
      });
    },
  },
};
