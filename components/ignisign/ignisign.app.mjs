import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ignisign",
  propDefinitions: {
    signatureProfileId: {
      type: "string",
      label: "Signature Profile ID",
      description: "The unique identifier of the signature profile",
      async options() {
        const data = await this.listSignatureProfiles();

        return data.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    signerProfileId: {
      type: "string",
      label: "Signer Profile ID",
      description: "The unique identifier of the signer profile",
      async options() {
        const data = await this.listSignerProfiles();

        return data.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    signerIds: {
      type: "string[]",
      label: "Signer IDs",
      description: "The unique identifier of the signers",
      async options({ page }) {
        const { signers } = await this.listSigners({
          params: {
            page,
          },
        });

        return signers.map(({
          signerId: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    signatureRequestId: {
      type: "string",
      label: "Signature Request ID",
      description: "The unique identifier of the asignature requests",
      async options({ page }) {
        const { signatureRequests } = await this.listSignatureRequests({
          params: {
            page: page + 1,
          },
        });

        return signatureRequests.filter(({ status }) => status === "COMPLETED").map(({
          _id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The unique identifier of the asignature request documents",
      async options({
        page, signatureRequestId,
      }) {
        const { documents } = await this.getSignatureRequestContext({
          signatureRequestId,
          params: {
            page,
          },
        });

        return documents.map(({
          _id: value, fileName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "An external identifier for the signer",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the signer",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the signer",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the signer",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the signer",
    },
    nationality: {
      type: "string",
      label: "Nationality",
      description: "The nationality of the signer in ISO 3166-1 alpha-2",
    },
    birthDate: {
      type: "string",
      label: "Birth Date",
      description: "The birth date of the signer",
    },
    birthPlace: {
      type: "string",
      label: "Birth Place",
      description: "The place of birth of the signer",
    },
    birthCountry: {
      type: "string",
      label: "Birth Country",
      description: "The country of birth of the signer in ISO 3166-1 alpha-2",
    },
  },
  methods: {
    _baseUrl(envs = `/applications/${this.$auth.app_id}/envs/${this.$auth.app_env}`) {
      return `https://api.ignisign.io/v4${envs}`;
    },
    _headers(headers = {}) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, envs, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(envs) + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    createSigner(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/signers",
        ...opts,
      });
    },
    listSignatureProfiles(opts = {}) {
      return this._makeRequest({
        path: "/signature-profiles",
        ...opts,
      });
    },
    listSignatureRequests(opts = {}) {
      return this._makeRequest({
        path: "/signature-requests",
        ...opts,
      });
    },
    listSigners(opts = {}) {
      return this._makeRequest({
        path: "/signers-paginate",
        ...opts,
      });
    },
    listSignerProfiles(opts = {}) {
      return this._makeRequest({
        path: "/signer-profiles",
        ...opts,
      });
    },
    initDocument(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/init-documents",
        ...opts,
      });
    },
    initSignatureRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/signature-requests",
        ...opts,
      });
    },
    updateSignatureRequest({
      signatureRequestId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/signature-requests/${signatureRequestId}`,
        envs: "",
        ...opts,
      });
    },
    getSignatureRequestContext({ signatureRequestId }) {
      return this._makeRequest({
        path: `/signature-requests/${signatureRequestId}/context`,
        envs: "",
      });
    },
    getSignatureProof({
      documentId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/${documentId}/signature-proof/PDF_WITH_SIGNATURES`,
        envs: "",
        ...opts,
      });
    },
    getSignerProfileInputs({ signerProfileId }) {
      return this._makeRequest({
        path: `/signer-profiles/${signerProfileId}/inputs-needed`,
      });
    },
    getSignerDetails({ signerId }) {
      return this._makeRequest({
        path: `/signers/${signerId}/details`,
      });
    },
    uploadFile({
      documentId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/${documentId}/file`,
        envs: "",
        ...opts,
      });
    },
    publishSignatureRequest({ signatureRequestId }) {
      return this._makeRequest({
        method: "POST",
        path: `/signature-requests/${signatureRequestId}/publish`,
        envs: "",
      });
    },
    closeSignatureRequest({ signatureRequestId }) {
      return this._makeRequest({
        method: "POST",
        path: `/signature-requests/${signatureRequestId}/close`,
        envs: "",
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
        envs: "",
      });
    },
    disableWebhookEvents(webhookId) {
      return this._makeRequest({
        method: "POST",
        path: `/webhooks/${webhookId}/disabled-events`,
        envs: "",
        data: {
          topics: {
            "ALL": true,
            "APP": true,
            "SIGNATURE": true,
            "SIGNATURE_REQUEST": true,
            "SIGNER": true,
            "SIGNATURE_PROFILE": true,
            "SIGNATURE_SESSION": true,
            "SIGNATURE_SIGNER_IMAGE": true,
            "ID_PROOFING": true,
            "SIGNER_AUTH": true,
          },
        },
      });
    },
  },
};
