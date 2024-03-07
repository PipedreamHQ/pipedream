import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reachmail",
  propDefinitions: {
    mailingId: {
      type: "string",
      label: "Mailing ID",
      description: "The mailing ID corresponds to a mailing that was previously configured.",
    },
    emailContent: {
      type: "string",
      label: "Email Content",
      description: "The content of the email to be sent.",
    },
    recipient: {
      type: "string",
      label: "Recipient Email",
      description: "The email address of the recipient.",
    },
    subject: {
      type: "string",
      label: "Email Subject",
      description: "The subject of the email.",
    },
    cc: {
      type: "string",
      label: "CC",
      description: "Carbon Copy - The email address(es) to CC.",
      optional: true,
    },
    bcc: {
      type: "string",
      label: "BCC",
      description: "Blind Carbon Copy - The email address(es) to BCC.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to categorize the email.",
      optional: true,
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "Attachments for the email. Provide the file paths.",
      optional: true,
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list from which the recipient should be opted out.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://services.reachmail.net";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async scheduleCampaign({ mailingId }) {
      return this._makeRequest({
        method: "POST",
        path: "/campaigns/scheduled",
        data: {
          mailingId,
        },
      });
    },
    async sendTransactionalEmail({
      emailContent, recipient, subject, cc, bcc, tags, attachments,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/easysmtp",
        data: {
          emailContent,
          recipient,
          subject,
          cc,
          bcc,
          tags,
          attachments,
        },
      });
    },
    async optOutRecipient({
      recipient, listId,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/lists/optout/${listId}`,
        data: {
          recipient,
        },
      });
    },
  },
};
