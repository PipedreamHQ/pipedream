import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "signaturit",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Required Props for Creating Certified Email
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "List of file URLs or paths to attach to the email.",
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "List of recipients in JSON format, e.g., '{\"name\": \"John Doe\", \"email\": \"john@example.com\"}'.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of certified email.",
      options: [
        "email",
        "sms",
        "url",
      ],
    },
    templates: {
      type: "string[]",
      label: "Templates",
      description: "List of template IDs or names to use in the email.",
    },
    // Required Props for Creating Signature Request
    files: {
      type: "string[]",
      label: "Files",
      description: "List of file URLs or paths to attach for the signature request.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name assigned to the signature request.",
    },
    // Required Prop for Sending Reminder
    signatureRequestId: {
      type: "string",
      label: "Signature Request ID",
      description: "ID of the signature request to send a reminder for.",
    },
    // Optional Props
    body: {
      type: "string",
      label: "Body",
      description: "Email/SMS body.",
      optional: true,
    },
    brandingId: {
      type: "string",
      label: "Branding ID",
      description: "ID of the branding to use.",
      optional: true,
    },
    eventsUrl: {
      type: "string",
      label: "Events URL",
      description: "URL to receive real-time events.",
      optional: true,
    },
    data: {
      type: "string[]",
      label: "Custom Data",
      description: "Custom key-value data in JSON format.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject.",
      optional: true,
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "URL to redirect the user after signing.",
      optional: true,
    },
    deliveryType: {
      type: "string",
      label: "Delivery Type",
      description: "Delivery type for signature request.",
      options: [
        "email",
        "sms",
        "url",
      ],
      optional: true,
    },
    expireTime: {
      type: "integer",
      label: "Expiration Time (days)",
      description: "Expiration time of the document in days (max 365).",
      min: 1,
      max: 365,
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "Email Reply-To address.",
      optional: true,
    },
    reminders: {
      type: "integer[]",
      label: "Reminders (days)",
      description: "Reminders in days to send automatic reminders.",
      optional: true,
    },
    signingMode: {
      type: "string",
      label: "Signing Mode",
      description: "Signing mode: sequential or parallel.",
      options: [
        "sequential",
        "parallel",
      ],
      optional: true,
    },
    typeSignature: {
      type: "string",
      label: "Signature Type",
      description: "Type of signature request.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.signaturit.com/v3";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.access_token}`,
        },
      });
    },
    async createCertifiedEmail() {
      return this._makeRequest({
        method: "POST",
        path: "/emails.json",
        data: {
          attachments: this.attachments,
          recipients: JSON.parse(`[${this.recipients.join(",")}]`),
          type: this.type,
          templates: this.templates,
          body: this.body,
          branding_id: this.brandingId,
          events_url: this.eventsUrl,
          data: this.data
            ? JSON.parse(`[${this.data.join(",")}]`)
            : undefined,
          subject: this.subject,
        },
      });
    },
    async createSignatureRequest() {
      return this._makeRequest({
        method: "POST",
        path: "/signatures.json",
        data: {
          files: this.files,
          name: this.name,
          recipients: JSON.parse(`[${this.recipients.join(",")}]`),
          body: this.body,
          branding_id: this.brandingId,
          callback_url: this.callbackUrl,
          data: this.data
            ? JSON.parse(`[${this.data.join(",")}]`)
            : undefined,
          delivery_type: this.deliveryType,
          expire_time: this.expireTime,
          events_url: this.eventsUrl,
          reply_to: this.replyTo,
          reminders: this.reminders,
          signing_mode: this.signingMode,
          subject: this.subject,
          type: this.typeSignature,
        },
      });
    },
    async sendReminder() {
      return this._makeRequest({
        method: "POST",
        path: `/signatures/${this.signatureRequestId}/reminders.json`,
      });
    },
    async listCompletedSignatures() {
      return this.paginate(this.getCompletedSignatures, {
        status: "completed",
      });
    },
    async getCompletedSignatures(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/signatures.json",
        params: {
          status: opts.status,
          page: opts.page || 1,
        },
      });
    },
    async paginate(fn, params) {
      let results = [];
      let page = 1;
      let hasMore = true;
      while (hasMore) {
        const response = await fn({
          ...params,
          page,
        });
        if (!response || response.length === 0) {
          hasMore = false;
        } else {
          results = results.concat(response);
          page += 1;
        }
      }
      return results;
    },
  },
};
