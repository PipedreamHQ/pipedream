import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import { getEnvelopeId } from "./common/utils.mjs";

export default {
  type: "app",
  app: "nevtan_sign",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The 24-character ID of the workspace to act on. Example: `66f0a1b2c3d4e5f6a7b8c9d0`. Leave blank to use the personal workspace of the account that owns the API key. To target a team workspace, pass that workspace's ID: the `id` field of the workspace in the NevTan Sign workspaces API. The account must be a member of the workspace.",
      optional: true,
    },
    envelopeId: {
      type: "string",
      label: "Envelope ID",
      description: "The 24-character ID of the envelope. Example: `6731f0a2c4b5d6e7f8a9b0c1`. Use **List Envelopes** to find it (the `_id` field).",
      async options({ workspaceId }) {
        const envelopes = await this.listEnvelopes({
          workspaceId,
        });
        return envelopes.map((envelope) => ({
          label: envelope.title || envelope.subject || getEnvelopeId(envelope),
          value: getEnvelopeId(envelope),
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The 24-character ID of the template to create the envelope from. Example: `672b9c1de4f5a6b7c8d9e0f1`. The NevTan Sign API has no template lookup available to API keys; copy the ID from the template's URL in the NevTan Sign dashboard (`/templates/{templateId}/build`).",
    },
    envelopeTypeId: {
      type: "string",
      label: "Envelope Type ID",
      description: "The 24-character ID of the envelope (agreement) type. Example: `68b287ab757648f9b762cfa2`. Use **List Envelope Types** to find it (the `id` field).",
      async options() {
        const types = await this.listEnvelopeTypes();
        return types.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return. Example: `25`. Defaults to `100`.",
      optional: true,
      default: 100,
      min: 1,
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
    /**
     * The envelope list is not paginated: it returns every envelope visible to
     * the caller in the workspace, newest first.
     */
    async listEnvelopes(opts = {}) {
      const { data } = await this._makeRequest({
        path: "/envelopes",
        ...opts,
      });
      return data ?? [];
    },
    async listEnvelopeTypes(opts = {}) {
      const { data } = await this._makeRequest({
        path: "/envelope-types",
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
