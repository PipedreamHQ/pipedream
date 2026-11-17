import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "nevtan_mail",
  propDefinitions: {
    emailId: {
      type: "string",
      label: "Email",
      description: "The email to act on. Pick one from the list, or set the `id` returned by **List Emails** or **Find Emails**. e.g. `45060`",
      async options({ page }) {
        if (page > 0) {
          return [];
        }
        const emails = await this.listEmails({
          params: {
            folder: "inbox",
            limit: constants.MAX_LIMIT,
          },
        });
        return emails.map(({
          id, subject, from,
        }) => ({
          label: subject?.trim()
            ? `${subject} — ${from}`
            : `(no subject) — ${from}`,
          value: id,
        }));
      },
    },
    folder: {
      type: "string",
      label: "Folder",
      description: "Which folder to read from. e.g. `inbox`",
      options: constants.FOLDERS,
      default: "inbox",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of emails to return (1–${constants.MAX_LIMIT}). e.g. \`25\``,
      optional: true,
      default: constants.DEFAULT_LIMIT,
      min: 1,
      max: constants.MAX_LIMIT,
    },
    to: {
      type: "string[]",
      label: "To",
      description: "One or more recipient email addresses. e.g. `[\"jane@example.com\", \"joe@example.com\"]`",
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "One or more CC email addresses. e.g. `[\"billing@example.com\"]`",
      optional: true,
    },
    bcc: {
      type: "string[]",
      label: "BCC",
      description: "One or more BCC email addresses. e.g. `[\"archive@example.com\"]`",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The email subject. e.g. `Invoice 88 — PO number query`",
    },
    body: {
      type: "string",
      label: "Body",
      description:
        "The message body. Plain text is escaped and line breaks become `<br>` unless **Is HTML** is set. e.g. `<p>Thanks for your message.</p>`",
    },
    isHtml: {
      type: "boolean",
      label: "Is HTML",
      description:
        "Set to `true` to send **Body** as HTML, e.g. `true` for `<p>Hello</p>`. Left unset, NevTan Mail detects HTML from the content.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "A verified domain in your workspace. Defaults to the workspace's primary domain. e.g. `example.com`",
      optional: true,
      async options() {
        const mailboxes = await this.listMailboxes();
        const domains = new Set(mailboxes
          .map(({ domain }) => domain)
          .filter(Boolean));
        return [
          ...domains,
        ];
      },
    },
  },
  methods: {
    _baseUrl() {
      const configured = this.$auth.base_url?.trim();
      return (configured || constants.BASE_URL).replace(/\/+$/, "");
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    // NevTan Mail rewrites 400 responses to 200 for every path outside its billing
    // endpoints, so a rejected request arrives as a success carrying an error body.
    // The status code cannot be trusted here; the body has to be inspected instead.
    _throwOnErrorEnvelope(response) {
      if (!response || typeof response !== "object" || Array.isArray(response)) {
        return response;
      }
      if (typeof response.error === "string") {
        throw new Error(`NevTan Mail rejected the request: ${response.error}`);
      }
      if (response.status === "ERROR") {
        const reason = response.message || "no reason given";
        throw new Error(`NevTan Mail rejected the request: ${reason}`);
      }
      return response;
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const response = await axios($, {
        url: `${this._baseUrl()}/api/v1${path}`,
        headers: this._headers(),
        ...opts,
      });
      return this._throwOnErrorEnvelope(response);
    },
    getAuthenticatedUser(opts = {}) {
      return this._makeRequest({
        path: "/me",
        ...opts,
      });
    },
    listEmails(opts = {}) {
      return this._makeRequest({
        path: "/emails",
        ...opts,
      });
    },
    searchEmails(opts = {}) {
      return this._makeRequest({
        path: "/emails/search",
        ...opts,
      });
    },
    getEmail({
      emailId, ...opts
    }) {
      return this._makeRequest({
        path: `/emails/${encodeURIComponent(emailId)}`,
        ...opts,
      });
    },
    sendEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/emails/send",
        ...opts,
      });
    },
    replyToEmail({
      emailId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/emails/${encodeURIComponent(emailId)}/reply`,
        ...opts,
      });
    },
    createDraft(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/drafts",
        ...opts,
      });
    },
    listMailboxes(opts = {}) {
      return this._makeRequest({
        path: "/mailboxes",
        ...opts,
      });
    },
    createMailbox(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/mailboxes",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/hooks",
        ...opts,
      });
    },
    deleteHook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hooks/${hookId}`,
        ...opts,
      });
    },
  },
};
