import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "elastic_email",
  version: "0.0.{{ts}}",
  propDefinitions: {
    sendEmailRecipients: {
      type: "string[]",
      label: "Recipient Email Addresses",
      description: "Email addresses of the recipients",
    },
    sendEmailSubject: {
      type: "string",
      label: "Email Subject",
      description: "Subject of the email",
    },
    sendEmailBody: {
      type: "string",
      label: "Email Body",
      description: "Body content of the email",
    },
    addContactEmail: {
      type: "string",
      label: "Contact Email Address",
      description: "Email address of the contact to add",
    },
    addContactListName: {
      type: "string",
      label: "Mailing List Name",
      description: "Name of the mailing list to add the contact to",
      optional: true,
    },
    unsubscribeEmail: {
      type: "string",
      label: "Email Address to Unsubscribe",
      description: "Email address of the contact to unsubscribe",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "URL to receive webhook events from Elastic Email",
      optional: true,
    },
    listNames: {
      type: "string[]",
      label: "List Names",
      description: "Names of the mailing lists",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.elasticemail.com/v4";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        params,
        data,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "X-ElasticEmail-ApiKey": this.$auth.api_key,
        },
        params,
        data,
      });
    },
    async sendBulkEmails(opts = {}) {
      const recipients = this.sendEmailRecipients.map((email) => ({
        Email: email,
      }));
      const data = {
        Recipients: recipients,
        Content: {
          Body: this.sendEmailBody,
          Subject: this.sendEmailSubject,
          From: this.$auth.from_email,
          IsPlainText: false,
        },
        Options: {
          // Add any additional email options here if needed
        },
      };
      return this._makeRequest({
        method: "POST",
        path: "/emails",
        data,
        ...opts,
      });
    },
    async sendTransactionalEmails(opts = {}) {
      const recipients = this.sendEmailRecipients.map((email) => ({
        Email: email,
      }));
      const data = {
        Recipients: recipients,
        Content: {
          Body: this.sendEmailBody,
          Subject: this.sendEmailSubject,
          From: this.$auth.from_email,
          IsPlainText: false,
        },
        Options: {
          // Add any additional transactional email options here if needed
        },
      };
      return this._makeRequest({
        method: "POST",
        path: "/emails/transactional",
        data,
        ...opts,
      });
    },
    async addContact(opts = {}) {
      const data = [
        {
          Email: this.addContactEmail,
          Status: "Active",
          ...(this.addContactListName && {
            Lists: [
              this.addContactListName,
            ],
          }),
        },
      ];
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data,
        ...opts,
      });
    },
    async unsubscribeContact(opts = {}) {
      const data = [
        {
          Email: this.unsubscribeEmail,
          Status: "Unsubscribed",
        },
      ];
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data,
        ...opts,
      });
    },
    async registerWebhook(opts = {}) {
      if (!this.webhookUrl) {
        throw new Error("Webhook URL is required to register a webhook.");
      }
      const data = {
        Events: [
          "Open",
          "Click",
          "ContactAdded",
        ],
        Url: this.webhookUrl,
      };
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        data,
        ...opts,
      });
    },
    async paginate(fn, ...opts) {
      const results = [];
      let hasMore = true;
      let page = 0;
      while (hasMore) {
        const response = await fn({
          ...opts,
          page,
        });
        if (!response || response.length === 0) {
          hasMore = false;
        } else {
          results.push(...response);
          page += 1;
        }
      }
      return results;
    },
  },
};
