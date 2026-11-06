import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kovapdf",
  propDefinitions: {
    signRequestId: {
      type: "string",
      label: "Signature Request ID",
      description: "The ID of a signature request, from the `id` field returned by **List Signature Requests** or **Send Document for Signature**. Example: `3f2b8c1e-7d4a-4f6e-9b21-5c8d0e7a1f34`",
      async options() {
        const { requests } = await this.listSignatureRequests();
        return requests.map((request) => ({
          label: `${request.title} (${request.status})`,
          value: request.id,
        }));
      },
    },
    file: {
      type: "string",
      label: "PDF File",
      description: "A PDF file. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/contract.pdf`).",
      format: "file-ref",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.kovapdf.com/api/v1";
    },
    _makeRequest({
      $ = this, path, headers = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listSignatureRequests(opts = {}) {
      return this._makeRequest({
        path: "/sign-requests",
        ...opts,
      });
    },
    getSignatureRequest({
      signRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/sign-requests/${encodeURIComponent(signRequestId)}`,
        ...opts,
      });
    },
    createSignatureRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sign-requests",
        ...opts,
      });
    },
    downloadDocument({
      signRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/sign-requests/${encodeURIComponent(signRequestId)}/document`,
        responseType: "arraybuffer",
        ...opts,
      });
    },
    verifyPdf(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/verify",
        ...opts,
      });
    },
  },
};
