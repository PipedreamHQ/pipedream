import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sare",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the lead.",
    },
    gsm: {
      type: "string",
      label: "GSM",
      description: "The GSM number of the lead.",
      optional: true,
    },
    group: {
      type: "string",
      label: "Group",
      description: "The group to assign the email lead to.",
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "The email addresses of the leads to remove from groups.",
    },
    groups: {
      type: "string[]",
      label: "Groups",
      description: "The groups to remove the email leads from.",
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
  },
  methods: {
    _baseUrl() {
      return "https://dev.sare.pl/rest-api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async addEmailLead({
      email, gsm, group,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/addEmailLead",
        data: {
          email,
          gsm,
          group,
        },
      });
    },
    async removeEmailLeadsFromGroups({
      emails, groups,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/removeEmailLeadsFromGroups",
        data: {
          emails,
          groups,
        },
      });
    },
    async sendTransactionalEmail({
      email, subject, from, ...otherProps
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/sendTransactionalEmail",
        data: {
          email,
          subject,
          from,
          ...otherProps,
        },
      });
    },
  },
};
