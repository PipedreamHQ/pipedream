import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "signaturit",
  propDefinitions: {
    body: {
      type: "string",
      label: "Body",
      description: "Email body (html code is allowed).",
    },
    brandingId: {
      type: "string",
      label: "Branding ID",
      description: "ID of the branding to use.",
      async options() {
        const data = await this.listBrandings();

        return data.map(({ id }) => id);
      },
    },
    eventsUrl: {
      type: "string",
      label: "Events URL",
      description: "URL to receive real-time events.",
    },
    data: {
      type: "object",
      label: "Custom Data",
      description: "Custom key-value data in JSON format.",
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "A list of paths to the files saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "List of recipients in JSON format, e.g., '{\"name\": \"John Doe\", \"email\": \"john@example.com\"}'. [See the documentation](https://docs.signaturit.com/api/latest#emails_create_email) for further information.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject for **email** type requests.",
    },
    templates: {
      type: "string[]",
      label: "Templates",
      description: "Templates to use in the signature request.",
      async options({ page }) {
        const data = await this.listTemplates({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    signatureRequestId: {
      type: "string",
      label: "Signature Request ID",
      description: "ID of the signature request to send a reminder for.",
      async options({ page }) {
        const data = await this.listSignatureRequests({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({ id }) => id);
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}.signaturit.com/v3`;
    },
    _headers(headers = {}) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.access_token}`,
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
    listBrandings() {
      return this._makeRequest({
        path: "/brandings.json",
      });
    },
    listTemplates() {
      return this._makeRequest({
        path: "/templates.json",
      });
    },
    createCertifiedEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/emails.json",
        ...opts,
      });
    },
    createSignatureRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/signatures.json",
        ...opts,
      });
    },
    sendReminder({
      signatureRequestId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/signatures/${signatureRequestId}/reminder.json`,
        ...opts,
      });
    },
    listSignatureRequests(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/signatures.json",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page;
        page++;

        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
