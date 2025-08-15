import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lumin_pdf",
  propDefinitions: {
    signatureRequestId: {
      type: "string",
      label: "Signature Request ID",
      description: "The ID of the signature request",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.luminpdf.com/v1";
    },
    _headers(headers = {}) {
      return {
        "x-api-key": `${this.$auth.api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    getSignatureRequest({
      signatureRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/signature_request/${signatureRequestId}`,
        ...opts,
      });
    },
    sendSignatureRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/signature_request/send",
        ...opts,
      });
    },
    cancelSignatureRequest({
      signatureRequestId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/signature_request/cancel/${signatureRequestId}`,
        ...opts,
      });
    },
    downloadFileAsFileUrl({
      signatureRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/signature_request/files_as_file_url/${signatureRequestId}`,
        ...opts,
      });
    },
    downloadFile({
      signatureRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/signature_request/files/${signatureRequestId}`,
        ...opts,
      });
    },
    getUserInformation(opts = {}) {
      return this._makeRequest({
        path: "/user/info",
        ...opts,
      });
    },
  },
};
