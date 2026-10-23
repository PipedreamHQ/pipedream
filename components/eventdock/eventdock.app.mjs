import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "eventdock",
  propDefinitions: {
    // EventDock API key (custom-auth field surfaced as `this.$auth.api_key`).
    // Declared as a secret string so Pipedream masks it in the UI, logs, and
    // step exports. The actual auth config lives in the Pipedream app registry;
    // this definition documents the field and enforces secret masking wherever
    // a component references it as a prop.
    apiKey: {
      type: "string",
      label: "API Key",
      description:
        "Your EventDock API key (starts with `evdk_`). Create one in the EventDock dashboard under Settings → API Keys.",
      secret: true,
    },
    provider: {
      type: "string",
      label: "Provider",
      description:
        "The webhook source. Pick a known provider to unlock EventDock signature verification and provider-aware de-duplication, or `generic` for any other source.",
      options: [
        { label: "Generic (any source)", value: "generic" },
        { label: "Stripe", value: "stripe" },
        { label: "Shopify", value: "shopify" },
        { label: "GitHub", value: "github" },
        { label: "Twilio", value: "twilio" },
      ],
      default: "generic",
    },
    providerSecret: {
      type: "string",
      label: "Signing Secret",
      description:
        "Optional. The provider signing secret (e.g. Stripe webhook secret). When set for a known provider, EventDock verifies each incoming signature before accepting and forwarding the event. Ignored for the `generic` provider.",
      secret: true,
      optional: true,
    },
  },
  methods: {
    /**
     * EventDock API base URL. Override via the `EVENTDOCK_BASE_URL` env var only
     * for self-hosted / staging deployments.
     */
    _baseUrl() {
      return (process.env.EVENTDOCK_BASE_URL || "https://api.eventdock.app").replace(/\/+$/, "");
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    /**
     * POST /v1/endpoints — create an EventDock endpoint whose upstream
     * destination is the given URL (the Pipedream source's HTTP endpoint).
     */
    createEndpoint({
      name, upstreamUrl, provider, providerSecret, ...opts
    }) {
      const data = {
        name,
        upstream_url: upstreamUrl,
        provider,
        ...(provider !== "generic" && providerSecret
          ? { provider_secret: providerSecret }
          : {}),
      };
      return this._makeRequest({
        method: "POST",
        path: "/v1/endpoints",
        data,
        ...opts,
      });
    },
    /**
     * PATCH /v1/endpoints/:id — update mutable fields on an existing endpoint.
     * The backend accepts name / upstream_url / status / provider_secret. It does
     * NOT accept `provider` (the provider is immutable once an endpoint is
     * created), so a provider CHANGE must be handled by create-new + delete-old,
     * not by patching. We use this to push a ROTATED provider_secret onto an
     * otherwise-matching endpoint so its signature-verification settings stay
     * current without orphaning the endpoint.
     */
    updateEndpoint({
      endpointId, ...data
    }) {
      const {
        $, ...body
      } = data;
      return this._makeRequest({
        ...($ ? { $ } : {}),
        method: "PATCH",
        path: `/v1/endpoints/${encodeURIComponent(endpointId)}`,
        data: body,
      });
    },
    /**
     * DELETE /v1/endpoints/:id — soft-delete the endpoint on source teardown.
     */
    deleteEndpoint({
      endpointId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/v1/endpoints/${encodeURIComponent(endpointId)}`,
        ...opts,
      });
    },
    /**
     * GET /v1/endpoints — list active endpoints for the authenticated tenant.
     */
    listEndpoints(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/v1/endpoints",
        ...opts,
      });
    },
    /**
     * GET /v1/usage — cheap, read-only call used to validate the API key.
     */
    getUsage(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/v1/usage",
        ...opts,
      });
    },
    /**
     * Cheap auth test, mirroring the n8n credential test: hits the read-only,
     * side-effect-free GET /v1/usage endpoint. Returns true on 200; throws (via
     * axios) on 401/invalid key so callers can surface a clear auth error.
     */
    async testAuth(opts = {}) {
      await this.getUsage(opts);
      return true;
    },
  },
};
