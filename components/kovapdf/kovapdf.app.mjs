import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kovapdf",
  propDefinitions: {
    signRequestId: {
      type: "string",
      label: "Signature Request ID",
      description: "The ID of a signature request, from the `id` field returned by **List Signature Requests** or **Send Document for Signature**. Example: `3f2b8c1e-7d4a-4f6e-9b21-5c8d0e7a1f34`",
      /** Signature requests of the connected account, for the dropdown. */
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
    /** The base URL of the KovaPDF API v1. */
    _baseUrl() {
      return "https://api.kovapdf.com/api/v1";
    },
    /** Calls the KovaPDF API with the connected account's API key as a Bearer token. */
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
    /** Lists the signature requests of the connected account. */
    listSignatureRequests(opts = {}) {
      return this._makeRequest({
        path: "/sign-requests",
        ...opts,
      });
    },
    /** Gets one signature request with its signers and status. */
    getSignatureRequest({
      signRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/sign-requests/${encodeURIComponent(signRequestId)}`,
        ...opts,
      });
    },
    /** Sends a new signature request (a PDF plus the request spec). */
    createSignatureRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sign-requests",
        ...opts,
      });
    },
    /** Downloads a signature request's document as binary data. */
    downloadDocument({
      signRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/sign-requests/${encodeURIComponent(signRequestId)}/document`,
        responseType: "arraybuffer",
        ...opts,
      });
    },
    /** Checks the digital signatures in a PDF and returns the report. */
    verifyPdf(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/verify",
        ...opts,
      });
    },
  },
};
