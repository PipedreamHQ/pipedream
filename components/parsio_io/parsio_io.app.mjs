import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "parsio_io",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name of the mailbox to create",
    },
    emailPrefix: {
      type: "string",
      label: "Email Prefix",
      description: "Custom prefix for the mailbox email address",
    },
    processAttachments: {
      type: "boolean",
      label: "Process Attachments",
      description: "Specifies whether to process attachments automatically",
      optional: true,
    },
    collectEmails: {
      type: "boolean",
      label: "Collect Emails",
      description: "Defines if emails should be collected automatically from the mailbox",
      optional: true,
    },
    alertEmailH: {
      type: "string",
      label: "Alert Email H",
      description: "Optional email address to receive alert notifications",
      optional: true,
    },
    mailboxId: {
      type: "string",
      label: "Mailbox ID",
      description: "Unique identifier of the mailbox",
      async options() {
        const response = await this.getMailboxes();
        return response.map(({
          name, _id,
        }) => ({
          label: name,
          value: _id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.parsio.io";
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
          "X-API-Key": `${this.$auth.api_key}`,
          ...headers,
        },
      });
    },
    async createMailbox(args = {}) {
      return this._makeRequest({
        path: "/mailboxes/create",
        method: "post",
        ...args,
      });
    },
    async updateMailbox({
      mailboxId, ...args
    }) {
      return this._makeRequest({
        path: `/mailboxes/${mailboxId}`,
        method: "post",
        ...args,
      });
    },
    async deleteMailbox({
      mailboxId, ...args
    }) {
      return this._makeRequest({
        path: `/mailboxes/${mailboxId}`,
        method: "delete",
        ...args,
      });
    },
    async getMailboxes(args = {}) {
      return this._makeRequest({
        path: "/mailboxes",
        ...args,
      });
    },
  },
};
