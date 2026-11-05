import {
  axios, getFileStreamAndMetadata,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "kovapdf",
  propDefinitions: {
    signRequestId: {
      type: "string",
      label: "Signature Request ID",
      description: "The ID of a signature request. Pick one from the list or use the **List Signature Requests** action to find it.",
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
    async getFileObject(file) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(file);
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return {
        name: metadata.name,
        contentBase64: Buffer.concat(chunks).toString("base64"),
      };
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
