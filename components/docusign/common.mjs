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
      description: "Document Template",
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
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $, config,
    }) {
      config.headers = this._getHeaders();
      try {
        return await axios($ ?? this, config);
      } catch (e) {
        throw new Error(e.response.data.message);
      }
    },
    async getBaseUri({
      $, accountId,
    }) {
      const { accounts } = await this.getUserInfo({
        $,
      });
      const account = accounts.find((a) => a.account_id === accountId);
      const { base_uri: baseUri } = account;
      return `${baseUri}/restapi/v2.1/accounts/${accountId}/`;
    },
    async listTemplates(baseUri) {
      const config = {
        method: "GET",
        url: `${baseUri}templates`,
      };
      return this._makeRequest({
        config,
      });
    },
    async listTemplateRecipients(baseUri, templateId) {
      const config = {
        method: "GET",
        url: `${baseUri}templates/${templateId}/recipients`,
      };
      return this._makeRequest({
        config,
      });
    },
    async getTemplate(baseUri, templateId) {
      const config = {
        method: "GET",
        url: `${baseUri}templates/${templateId}`,
      };
      return this._makeRequest({
        config,
      });
    },
    async listTemplateCustomFields(baseUri, templateId) {
      const config = {
        method: "GET",
        url: `${baseUri}templates/${templateId}/custom_fields`,
      };
      return this._makeRequest({
        config,
      });
    },
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
    async listDocumentFields(baseUri, templateId, documentId) {
      const config = {
        method: "GET",
        url: `${baseUri}templates/${templateId}/documents/${documentId}/fields`,
      };
      return this._makeRequest({
        config,
      });
    },
    async createEnvelope({
      $, baseUri, data,
    }) {
      const config = {
        method: "POST",
        url: `${baseUri}envelopes`,
        data,
      };
      return this._makeRequest({
        $,
        config,
      });
    },
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
    async listEnvelopes(baseUri, params) {
      const config = {
        method: "GET",
        url: `${baseUri}envelopes`,
        params,
      };
      return this._makeRequest({
        config,
      });
    },
  },
};
