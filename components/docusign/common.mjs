import { axios } from "@pipedream/platform";

export default {
  propDefinitions: {
    account: {
      type: "string",
      label: "Account",
      description: "Docusign Account",
      async options() {
        const { accounts } = await this.getUserInfo({});
        return accounts.map((account) => ({
          label: account.account_name,
          value: account.account_id,
        }));
      },
    },
    template: {
      type: "string",
      label: "Template",
      description: "Document Template. Note: Not all [tab types](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/enveloperecipienttabs/#tab-types) can be set.",
      async options({ account }) {
        const baseUri = await this.getBaseUri({
          accountId: account,
        });
        const { envelopeTemplates } = await this.listTemplates(baseUri);
        if (!envelopeTemplates) {
          throw new Error("No templates found");
        }
        return envelopeTemplates.map((template) => ({
          label: template.name,
          value: template.templateId,
        }));
      },
    },
    emailSubject: {
      type: "string",
      label: "Email Subject",
      description: "Subject line of email",
    },
    emailBlurb: {
      type: "string",
      label: "Email Blurb",
      description: "Email message to recipient. Overrides template setting.",
      optional: true,
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "Email address of signature request recipient",
    },
    recipientName: {
      type: "string",
      label: "Recipient Name",
      description: "The full name of the recipient",
    },
    role: {
      type: "string",
      label: "Recipient Role",
      description: "Choose role as defined on template or use a custom value",
      async options({
        account, template,
      }) {
        const baseUri = await this.getBaseUri({
          accountId: account,
        });
        const { signers } = await this.listTemplateRecipients(
          baseUri,
          template,
        );
        return signers.map((signer) => {
          return signer.roleName;
        });
      },
    },
  },
  methods: {
    /**
     * Build headers for authenticated DocuSign eSignature API requests.
     *
     * @returns {object} Headers for the current connected account.
     */
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    /**
     * Make an authenticated DocuSign API request.
     *
     * @param {object} args - Request arguments.
     * @param {object} args.$ - Pipedream step context.
     * @param {object} args.config - Axios request config.
     * @returns {Promise<object>} The DocuSign API response.
     */
    async _makeRequest({
      $, config,
    }) {
      config.headers = this._getHeaders();
      return axios($ ?? this, config);
    },
    /**
     * Resolve the account-specific eSignature REST base URI.
     *
     * @param {object} args - Request arguments.
     * @param {object} args.$ - Pipedream step context.
     * @param {string} args.accountId - DocuSign account ID.
     * @returns {Promise<string>} Account-scoped REST API base URI.
     */
    async getBaseUri({
      $, accountId,
    }) {
      const { accounts } = await this.getUserInfo({
        $,
      });
      const account = accounts.find((a) => a.account_id === accountId);
      if (!account) {
        throw new Error(`Unable to resolve DocuSign account for accountId: ${accountId}`);
      }
      const { base_uri: baseUri } = account;
      return `${baseUri}/restapi/v2.1/accounts/${accountId}/`;
    },
    /**
     * List envelope templates.
     *
     * @param {string} baseUri - Account-scoped REST API base URI.
     * @returns {Promise<object>} Template list response.
     */
    async listTemplates(baseUri) {
      const config = {
        method: "GET",
        url: `${baseUri}templates`,
      };
      return this._makeRequest({
        config,
      });
    },
    /**
     * List recipients configured on a template.
     *
     * @param {string} baseUri - Account-scoped REST API base URI.
     * @param {string} templateId - DocuSign template ID.
     * @returns {Promise<object>} Template recipients response.
     */
    async listTemplateRecipients(baseUri, templateId) {
      const config = {
        method: "GET",
        url: `${baseUri}templates/${templateId}/recipients`,
      };
      return this._makeRequest({
        config,
      });
    },
    /**
     * Get a template by ID.
     *
     * @param {string} baseUri - Account-scoped REST API base URI.
     * @param {string} templateId - DocuSign template ID.
     * @returns {Promise<object>} Template details response.
     */
    async getTemplate(baseUri, templateId) {
      const config = {
        method: "GET",
        url: `${baseUri}templates/${templateId}`,
      };
      return this._makeRequest({
        config,
      });
    },
    /**
     * List custom fields for a template.
     *
     * @param {string} baseUri - Account-scoped REST API base URI.
     * @param {string} templateId - DocuSign template ID.
     * @returns {Promise<object>} Template custom fields response.
     */
    async listTemplateCustomFields(baseUri, templateId) {
      const config = {
        method: "GET",
        url: `${baseUri}templates/${templateId}/custom_fields`,
      };
      return this._makeRequest({
        config,
      });
    },
    /**
     * List all document tabs for a template.
     *
     * @param {string} baseUri - Account-scoped REST API base URI.
     * @param {string} templateId - DocuSign template ID.
     * @returns {Promise<object[]>} Document tab responses.
     */
    async listTemplateTabs(baseUri, templateId) {
      const tabs = [];
      const template = await this.getTemplate(baseUri, templateId);
      for (const { documentId } of template.documents) {
        const config = {
          method: "GET",
          url: `${baseUri}templates/${templateId}/documents/${documentId}/tabs`,
        };
        tabs.push(await this._makeRequest({
          config,
        }));
      }
      return tabs;
    },
    /**
     * List PDF form fields for a template document.
     *
     * @param {string} baseUri - Account-scoped REST API base URI.
     * @param {string} templateId - DocuSign template ID.
     * @param {string} documentId - Template document ID.
     * @returns {Promise<object>} Document fields response.
     */
    async listDocumentFields(baseUri, templateId, documentId) {
      const config = {
        method: "GET",
        url: `${baseUri}templates/${templateId}/documents/${documentId}/fields`,
      };
      return this._makeRequest({
        config,
      });
    },
    /**
     * Create an envelope.
     *
     * @param {object} args - Request arguments.
     * @param {object} args.$ - Pipedream step context.
     * @param {string} args.baseUri - Account-scoped REST API base URI.
     * @param {object} args.data - Envelope definition payload.
     * @param {object} args.params - Optional query parameters.
     * @returns {Promise<object>} Envelope creation response.
     */
    async createEnvelope({
      $, baseUri, data, params,
    }) {
      const config = {
        method: "POST",
        url: `${baseUri}envelopes`,
        data,
        params,
      };
      return this._makeRequest({
        $,
        config,
      });
    },
    /**
     * Get envelope details.
     *
     * @param {object} args - Request arguments.
     * @param {object} args.$ - Pipedream step context.
     * @param {string} args.baseUri - Account-scoped REST API base URI.
     * @param {string} args.envelopeId - DocuSign envelope ID.
     * @param {object} args.params - Optional query parameters.
     * @returns {Promise<object>} Envelope details response.
     */
    async getEnvelope({
      $, baseUri, envelopeId, params,
    }) {
      const config = {
        method: "GET",
        url: `${baseUri}envelopes/${envelopeId}`,
        params,
      };
      return this._makeRequest({
        $,
        config,
      });
    },
    /**
     * Update an envelope, for example to send or void it.
     *
     * @param {object} args - Request arguments.
     * @param {object} args.$ - Pipedream step context.
     * @param {string} args.baseUri - Account-scoped REST API base URI.
     * @param {string} args.envelopeId - DocuSign envelope ID.
     * @param {object} args.data - Envelope update payload.
     * @param {object} args.params - Optional query parameters.
     * @returns {Promise<object>} Envelope update response.
     */
    async updateEnvelope({
      $, baseUri, envelopeId, data, params,
    }) {
      const config = {
        method: "PUT",
        url: `${baseUri}envelopes/${envelopeId}`,
        data,
        params,
      };
      return this._makeRequest({
        $,
        config,
      });
    },
    /**
     * List folders for an account.
     *
     * @param {string} baseUri - Account-scoped REST API base URI.
     * @param {object} params - Optional query parameters.
     * @returns {Promise<object>} Folders response.
     */
    async listFolders(baseUri, params) {
      const config = {
        method: "GET",
        url: `${baseUri}folders`,
        params,
      };
      return this._makeRequest({
        config,
      });
    },
    /**
     * List items inside a folder.
     *
     * @param {string} baseUri - Account-scoped REST API base URI.
     * @param {object} params - Optional query parameters.
     * @param {string} folderId - DocuSign folder ID.
     * @returns {Promise<object>} Folder items response.
     */
    async listFolderItems(baseUri, params, folderId) {
      const config = {
        method: "GET",
        url: `${baseUri}folders/${folderId}`,
        params,
      };
      return this._makeRequest({
        config,
      });
    },
    /**
     * List envelopes matching search filters.
     *
     * @param {object} args - Request arguments.
     * @param {object} args.$ - Pipedream step context.
     * @param {string} args.baseUri - Account-scoped REST API base URI.
     * @param {object} args.params - Optional query parameters.
     * @returns {Promise<object>} Envelopes response.
     */
    async listEnvelopes({
      $, baseUri, params,
    }) {
      const config = {
        method: "GET",
        url: `${baseUri}envelopes`,
        params,
      };
      return this._makeRequest({
        $,
        config,
      });
    },
    /**
     * List documents in an envelope.
     *
     * @param {object} args - Request arguments.
     * @param {object} args.$ - Pipedream step context.
     * @param {string} args.baseUri - Account-scoped REST API base URI.
     * @param {string} args.envelopeId - DocuSign envelope ID.
     * @param {object} args.params - Optional query parameters.
     * @returns {Promise<object>} Envelope documents response.
     */
    async listEnvelopeDocuments({
      $, baseUri, envelopeId, params,
    }) {
      const config = {
        method: "GET",
        url: `${baseUri}envelopes/${envelopeId}/documents`,
        params,
      };
      return this._makeRequest({
        $,
        config,
      });
    },
    /**
     * List recipients and recipient status for an envelope.
     *
     * @param {object} args - Request arguments.
     * @param {object} args.$ - Pipedream step context.
     * @param {string} args.baseUri - Account-scoped REST API base URI.
     * @param {string} args.envelopeId - DocuSign envelope ID.
     * @param {object} args.params - Optional query parameters.
     * @returns {Promise<object>} Envelope recipients response.
     */
    async listRecipients({
      $, baseUri, envelopeId, params,
    }) {
      const config = {
        method: "GET",
        url: `${baseUri}envelopes/${envelopeId}/recipients`,
        params,
      };
      return this._makeRequest({
        $,
        config,
      });
    },
    /**
     * Create a recipient view URL for embedded signing.
     *
     * @param {object} args - Request arguments.
     * @param {object} args.$ - Pipedream step context.
     * @param {string} args.baseUri - Account-scoped REST API base URI.
     * @param {string} args.envelopeId - DocuSign envelope ID.
     * @param {object} args.data - Recipient view request payload.
     * @returns {Promise<object>} Recipient view URL response.
     */
    async createRecipientView({
      $, baseUri, envelopeId, data,
    }) {
      const config = {
        method: "POST",
        url: `${baseUri}envelopes/${envelopeId}/views/recipient`,
        data,
      };
      return this._makeRequest({
        $,
        config,
      });
    },
  },
};
