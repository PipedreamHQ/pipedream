import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hellosign",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template",
      description: "Identifier of a template",
      async options({ page }) {
        const { templates } = await this.listTemplates({
          params: {
            account_id: this.accountId(),
            page: page + 1,
          },
        });
        return templates?.map(({
          template_id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the signer(s)",
      async options({ templateId }) {
        const { template: { signer_roles: roles } } = await this.getTemplate({
          templateId,
        });
        return roles?.map(({ name }) => name ) || [];
      },
    },
    signers: {
      type: "object",
      label: "Signers",
      description: "Enter names & email addresses as key/value pairs with name as the key and email as the value.",
    },
    fileUrls: {
      type: "string[]",
      label: "File URLs",
      description: "An array of file URLs to send for signature",
    },
    ccEmailAddresses: {
      type: "string[]",
      label: "CC Email Addresses",
      description: "The email addresses that should be CCed.",
      optional: true,
    },
    allowDecline: {
      type: "boolean",
      label: "Allow Decline",
      description: "Allows signers to decline to sign a document",
      default: false,
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The custom message in the email that will be sent to the signers.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject in the email that will be sent to the signers.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title you want to assign to the SignatureRequest.",
      optional: true,
    },
    testMode: {
      type: "boolean",
      label: "Test Mode",
      description: "Whether this is a test, the signature request will not be legally binding if set to `true`.",
      default: false,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hellosign.com/v3";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    accountId() {
      return this.$auth.oauth_uid;
    },
    getTemplate({
      templateId, ...args
    }) {
      return this._makeRequest({
        path: `/template/${templateId}`,
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this._makeRequest({
        path: "/template/list",
        ...args,
      });
    },
    sendSignatureRequest(args = {}) {
      return this._makeRequest({
        path: "/signature_request/send",
        method: "POST",
        ...args,
      });
    },
    sendSignatureRequestWithTemplate(args = {}) {
      return this._makeRequest({
        path: "/signature_request/send_with_template",
        method: "POST",
        ...args,
      });
    },
  },
};
