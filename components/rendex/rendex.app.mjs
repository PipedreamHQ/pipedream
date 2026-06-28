import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rendex",
  propDefinitions: {
    markdown: {
      type: "string",
      label: "Markdown",
      description: "Markdown to render. Rendex applies clean default typography (no CSS needed) and converts it to an image or PDF.",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML markup to render to an image.",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "A page URL to render (alternative to HTML). Provide either `html` or `url`.",
      optional: true,
    },
    format: {
      type: "string",
      label: "Output Format",
      description: "Output file format. Example values: `png`, `jpeg`, `webp`, or `pdf`.",
      optional: true,
      default: "png",
      options: [
        "png",
        "jpeg",
        "webp",
        "pdf",
      ],
    },
    watchId: {
      type: "string",
      label: "Watch",
      description: "The watch to act on.",
      async options() {
        const { data } = await this.listWatches({
          params: {
            status: "all",
            limit: 100,
          },
        });
        return (data?.items ?? []).map((watch) => ({
          label: watch.name
            ? `${watch.name} (${watch.url})`
            : watch.url,
          value: watch.id,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "A human-friendly label for the watch.",
      optional: true,
    },
    intervalMinutes: {
      type: "integer",
      label: "Interval (minutes)",
      description: "Minutes between automatic checks. Per-plan floors apply (Free 1440, Starter 180, Pro 30, Enterprise 5).",
      optional: true,
      min: 5,
      max: 43200,
    },
    diffMode: {
      type: "string",
      label: "Diff Mode",
      description: "How a change is detected: `visual` (pixel diff), `text` (extracted text), or `both`.",
      optional: true,
      options: [
        "visual",
        "text",
        "both",
      ],
    },
    threshold: {
      type: "string",
      label: "Threshold",
      description: "Fraction of the page (between `0` and `1`) that must change to count as a change. Defaults to `0.01`.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "URL that receives an HMAC-signed POST when a change is detected. Requires a Starter plan or higher.",
      optional: true,
    },
    notifyEmail: {
      type: "string",
      label: "Notify Email",
      description: "Email to alert on a change. Must match the email on your Rendex account.",
      optional: true,
    },
    paused: {
      type: "boolean",
      label: "Paused",
      description: "When `true`, the watch is created/left paused and is not scheduled (no credits charged).",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of items to return (1–100).",
      optional: true,
      min: 1,
      max: 100,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Pagination cursor returned as `nextCursor` by a previous response.",
      optional: true,
    },
    extractFormat: {
      type: "string",
      label: "Extract Format",
      description: "Format of the extracted content.",
      optional: true,
      default: "markdown",
      options: [
        "markdown",
        "json",
        "html",
      ],
    },
    expiresIn: {
      type: "integer",
      label: "Expires In (seconds)",
      description: "How long the hosted render link stays valid (3600–2592000). Defaults to 30 days.",
      optional: true,
      min: 3600,
      max: 2592000,
    },
    width: {
      type: "integer",
      label: "Width",
      description: "Viewport width in pixels.",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "Viewport height in pixels.",
      optional: true,
    },
    fullPage: {
      type: "boolean",
      label: "Full Page",
      description: "Capture the entire scrollable page instead of just the viewport.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.rendex.dev";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._headers(),
          ...headers,
        },
        ...opts,
      });
    },
    /**
     * Render HTML or a URL to an image/PDF via POST /v1/screenshot/json.
     * @param {object} opts - axios options; `data` is the JSON request body.
     * @returns {Promise<object>} `{ success, data: { image, format, bytesSize, ... }, meta }`
     */
    renderJson(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/screenshot/json",
        ...opts,
      });
    },
    createWatch(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/watches",
        ...opts,
      });
    },
    listWatches(opts = {}) {
      return this._makeRequest({
        path: "/v1/watches",
        ...opts,
      });
    },
    getWatch(watchId, opts = {}) {
      return this._makeRequest({
        path: `/v1/watches/${watchId}`,
        ...opts,
      });
    },
    listRuns(watchId, opts = {}) {
      return this._makeRequest({
        path: `/v1/watches/${watchId}/runs`,
        ...opts,
      });
    },
    updateWatch(watchId, opts = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `/v1/watches/${watchId}`,
        ...opts,
      });
    },
    deleteWatch(watchId, opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/v1/watches/${watchId}`,
        ...opts,
      });
    },
    runWatch(watchId, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/watches/${watchId}/run`,
        ...opts,
      });
    },
    extract(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/extract",
        ...opts,
      });
    },
    createRenderLink(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/render/link",
        ...opts,
      });
    },
  },
};
