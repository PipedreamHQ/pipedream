import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "navigatr",
  propDefinitions: {
    badgeId: {
      type: "string",
      label: "Badge ID",
      description: "The unique identifier for the badge to be issued",
    },
    providerId: {
      type: "string",
      label: "Provider ID",
      description: "The unique identifier for the provider issuing the badge",
    },
    recipientId: {
      type: "string",
      label: "Recipient ID",
      description: "The unique identifier for the recipient of the badge. Required if recipient email is not provided.",
      optional: true,
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "The email address of the recipient of the badge. Required if recipient ID is not provided.",
      optional: true,
    },
    recipientFirstname: {
      type: "string",
      label: "Recipient First Name",
      description: "The first name of the recipient of the badge",
    },
    recipientLastname: {
      type: "string",
      label: "Recipient Last Name",
      description: "The last name of the recipient of the badge. Required if recipient organisation is not provided.",
      optional: true,
    },
    recipientOrganisation: {
      type: "string",
      label: "Recipient Organisation",
      description: "The organisation of the recipient of the badge. Required if recipient last name is not provided.",
      optional: true,
    },
    issueDate: {
      type: "string",
      label: "Issue Date",
      description: "The date the badge was issued. Format: YYYY-MM-DD",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The date the badge expires. Format: YYYY-MM-DD",
      optional: true,
    },
    evidenceText: {
      type: "string",
      label: "Evidence Text",
      description: "Textual evidence supporting the issuance of the badge",
      optional: true,
    },
    evidenceUrl: {
      type: "string",
      label: "Evidence URL",
      description: "URL to evidence supporting the issuance of the badge",
      optional: true,
    },
    score: {
      type: "integer",
      label: "Score",
      description: "The score achieved by the recipient",
      optional: true,
    },
    minScore: {
      type: "integer",
      label: "Minimum Score",
      description: "The minimum score required for the badge",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.navigatr.app";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path = "/",
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
    async issueBadge({
      badgeId,
      providerId,
      recipientId,
      recipientEmail,
      recipientFirstname,
      recipientLastname,
      recipientOrganisation,
      issueDate,
      endDate,
      evidenceText,
      evidenceUrl,
      score,
      minScore,
    }) {
      return this._makeRequest({
        path: `/badges/${badgeId}/issue`,
        data: {
          provider_id: providerId,
          recipient_id: recipientId,
          recipient_email: recipientEmail,
          recipient_firstname: recipientFirstname,
          recipient_lastname: recipientLastname,
          recipient_organisation: recipientOrganisation,
          issue_date: issueDate,
          end_date: endDate,
          evidence_text: evidenceText,
          evidence_url: evidenceUrl,
          score: score,
          min_score: minScore,
        },
      });
    },
  },
};
