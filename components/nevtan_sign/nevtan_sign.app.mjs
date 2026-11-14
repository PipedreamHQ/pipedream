import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "nevtan_sign",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the workspace to act on, sent as the `X-Workspace-Id` header. Leave blank to use the personal workspace of the account that owns the API key.",
      optional: true,
    },
    envelopeId: {
      type: "string",
      label: "Envelope ID",
      description: "The ID of the envelope",
      async options({ workspaceId }) {
        const envelopes = await this.listEnvelopes({
          workspaceId,
        });
        return envelopes.map((envelope) => ({
          label: envelope.title || envelope.subject || this.getEnvelopeId(envelope),
          value: this.getEnvelopeId(envelope),
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to create the envelope from. You can find it in the URL when the template is open in NevTan Sign.",
    },
  },
  methods: {
    _baseUrl() {
      return constants.BASE_URL;
    },
    _headers({
      workspaceId, headers,
    } = {}) {
      return {
        "X-API-Key": `${this.$auth.api_key}`,
        ...(workspaceId && {
          "X-Workspace-Id": workspaceId,
        }),
        ...headers,
      };
    },
    /**
     * NevTan Sign wraps every response as `{ status, message, data }` and
     * returns HTTP 200 with `status: "failure"` for business-logic errors,
     * so a 2xx response alone does not mean the request succeeded.
     */
    async _makeRequest({
      $ = this, path, workspaceId, headers, ...opts
    }) {
      const response = await axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers({
          workspaceId,
          headers,
        }),
        ...opts,
      });
      if (response?.status === "failure") {
        throw new Error(response.message || "NevTan Sign returned a failure response");
      }
      return response;
    },
    getEnvelopeId(envelope) {
      return envelope?._id ?? envelope?.id;
    },
    getStatusLabel(status) {
      return constants.ENVELOPE_STATUS_LABELS[status] ?? `${status}`;
    },
    /**
     * `GET /envelopes` is not paginated: it returns every envelope visible to
     * the caller in the workspace, newest first.
     */
    async listEnvelopes(opts = {}) {
      const { data } = await this._makeRequest({
        path: "/envelopes",
        ...opts,
      });
      return data ?? [];
    },
    createEnvelopeFromTemplate({
      templateId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/envelopes/from-template/${templateId}`,
        ...opts,
      });
    },
    voidEnvelope({
      envelopeId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/envelopes/${envelopeId}/void`,
        ...opts,
      });
    },
  },
};
