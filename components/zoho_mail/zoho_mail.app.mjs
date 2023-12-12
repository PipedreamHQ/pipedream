import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_mail",
  propDefinitions: {
    account: {
      type: "string",
      label: "Account ID",
      description: "The unique Zoho Account number associated with the particular account",
      async options() {
        const accounts = await this.listAccounts();
        return accounts.map((account) => ({
          label: account.displayName ?? account.accountId,
          value: account.accountId,
        }));
      },
    },
    fromAddress: {
      type: "string",
      label: "From Address",
      description: "Sender's email address for the From field",
      async options({ accountId }) {
        const accounts = await this.listAccounts();
        const account = accounts.filter((a) => a.accountId === accountId);
        return account[0].sendMailDetails.map((details) => details.fromAddress);
      },
    },
    max: {
      type: "integer",
      label: "Max",
      description: "Maximum number of emails to return at one time. Defaults to 10 if left blank.",
      min: 1,
      max: 200,
      optional: true,
    },
    toAddress: {
      type: "string",
      label: "To Address",
      description: "Recipient email address for the To field",
    },
    ccAddress: {
      type: "string",
      label: "Cc Address",
      description: "Recipient email address for the Cc field",
      optional: true,
    },
    bccAddress: {
      type: "string",
      label: "Bcc Address",
      description: "Recipient email address for the Bcc field",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the email that should be sent",
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content of the email that should be sent",
      optional: true,
    },
    mailFormat: {
      type: "string",
      label: "Mail Format",
      description: "Whether the email should be sent in HTML format or in plain text. The default value is html.",
      options: [
        "html",
        "plaintext",
      ],
      optional: true,
    },
    askReceipt: {
      type: "string",
      label: "Ask Receipt",
      description: "Whether you need to request Read receipt from the recipient. If required, enter the value as `yes`.",
      options: [
        "yes",
      ],
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title for the task that is being added",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The task description",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority to be given for the task",
      options: [
        "high",
        "medium",
        "low",
      ],
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date that you want to set for the task in `dd/mm/yyyy` format",
      optional: true,
    },
  },
  methods: {
    async makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `https://mail.${this.$auth.base_api_uri}/api/${path}`,
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
          "User-Agent": "@PipedreamHQ/pipedream v0.1",
        },
        ...otherArgs,
      };
      return axios($, config);
    },
    async listAccounts({ $ } = {}) {
      return (await this.makeRequest({
        path: "accounts",
        $,
      })).data;
    },
    async listEmails({
      $, accountId, params,
    } = {}) {
      return (await this.makeRequest({
        path: `accounts/${accountId}/messages/view`,
        params,
        $,
      })).data;
    },
    async createTask({
      $, data,
    } = {}) {
      return (await this.makeRequest({
        path: "tasks/me",
        method: "POST",
        data,
        $,
      })).data;
    },
    async sendEmail({
      $, accountId, data,
    } = {}) {
      return (await this.makeRequest({
        path: `accounts/${accountId}/messages`,
        method: "POST",
        data,
        $,
      })).data;
    },
  },
};
