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
      async options({ prevContext }) {
        // Cursor-based load-more: GET /v1/watches returns `nextCursor` (null on the
        // last page). A null cursor in prevContext means we already paged to the end.
        const cursor = prevContext?.cursor;
        if (cursor === null) {
          return [];
        }
        const { data } = await this.listWatches({
          params: {
            status: "all",
            limit: 100,
            cursor,
          },
        });
        return {
          options: (data?.items ?? []).map((watch) => ({
            label: watch.name
              ? `${watch.name} (${watch.url})`
              : watch.url,
            value: watch.id,
          })),
          context: {
            cursor: data?.nextCursor ?? null,
          },
        };
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
      description: "Viewport width in pixels (320–3840). Defaults to `1280`.",
      optional: true,
      min: 320,
      max: 3840,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "Viewport height in pixels (240–2160). Defaults to `800`.",
      optional: true,
      min: 240,
      max: 2160,
    },
    fullPage: {
      type: "boolean",
      label: "Full Page",
      description: "Capture the entire scrollable page instead of just the viewport.",
      optional: true,
    },
    quality: {
      type: "integer",
      label: "Quality",
      description: "Image quality from 1–100 (JPEG/WebP only).",
      optional: true,
      min: 1,
      max: 100,
    },
    delay: {
      type: "integer",
      label: "Delay (ms)",
      description: "Milliseconds to wait after the page settles before capturing (0–10000).",
      optional: true,
      min: 0,
      max: 10000,
    },
    darkMode: {
      type: "boolean",
      label: "Dark Mode",
      description: "Emulate `prefers-color-scheme: dark` when rendering.",
      optional: true,
    },
    deviceScaleFactor: {
      type: "string",
      label: "Device Scale Factor",
      description: "Pixel density multiplier from `1` to `3` (e.g. `2` for retina). Defaults to `2`.",
      optional: true,
    },
    device: {
      type: "string",
      label: "Device",
      description: "Device preset that sets viewport size, scale, and user agent in one shot. Explicit width/height/user agent still win.",
      optional: true,
      options: [
        "desktop",
        "iphone_15",
        "iphone_se",
        "pixel_8",
        "ipad",
        "ipad_pro",
      ],
    },
    selector: {
      type: "string",
      label: "Selector",
      description: "Capture only the element matching this CSS selector instead of the whole page.",
      optional: true,
    },
    hideSelectors: {
      type: "string[]",
      label: "Hide Selectors",
      description: "CSS selectors for elements to hide (`display: none`) before capture — e.g. cookie banners, popups, sticky nav.",
      optional: true,
    },
    blockAds: {
      type: "boolean",
      label: "Block Ads",
      description: "Block known ad/tracker network requests. Enabled by default.",
      optional: true,
    },
    blockCookieBanners: {
      type: "boolean",
      label: "Block Cookie Banners",
      description: "Hide common cookie/consent walls (OneTrust, Cookiebot, Quantcast, …) via a curated CSS list.",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout (seconds)",
      description: "Maximum time to wait for the page to load (5–60). Defaults to `30`.",
      optional: true,
      min: 5,
      max: 60,
    },
    waitUntil: {
      type: "string",
      label: "Wait Until",
      description: "Navigation lifecycle event to wait for before capturing.",
      optional: true,
      options: [
        "load",
        "domcontentloaded",
        "networkidle0",
        "networkidle2",
      ],
    },
    bestAttempt: {
      type: "boolean",
      label: "Best Attempt",
      description: "Return a partial capture on timeout instead of erroring. Enabled by default.",
      optional: true,
    },
    css: {
      type: "string",
      label: "Custom CSS",
      description: "CSS injected into the page before capture (up to 50KB).",
      optional: true,
    },
    js: {
      type: "string",
      label: "Custom JavaScript",
      description: "JavaScript executed in the page before capture (up to 50KB).",
      optional: true,
    },
    userAgent: {
      type: "string",
      label: "User Agent",
      description: "Override the browser User-Agent header.",
      optional: true,
    },
    cookies: {
      type: "string[]",
      label: "Cookies",
      description: "Cookies to set before loading the page. Each item is a JSON object, e.g. `{\"name\":\"session\",\"value\":\"abc\",\"domain\":\"example.com\"}`. Requires a Starter plan or higher.",
      optional: true,
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Extra HTTP request headers to send with the page load, as a JSON object of key–value pairs, e.g. `{ \"Accept-Language\": \"de-DE\", \"X-Debug\": \"1\" }`. Requires a Starter plan or higher.",
      optional: true,
    },
    pdfFormat: {
      type: "string",
      label: "PDF Format",
      description: "Paper size for PDF output (ignored for image formats).",
      optional: true,
      options: [
        "A4",
        "Letter",
        "Legal",
        "Tabloid",
        "A3",
      ],
    },
    pdfLandscape: {
      type: "boolean",
      label: "PDF Landscape",
      description: "Render the PDF in landscape orientation.",
      optional: true,
    },
    pdfPrintBackground: {
      type: "boolean",
      label: "PDF Print Background",
      description: "Include background graphics and colors in the PDF.",
      optional: true,
    },
    pdfScale: {
      type: "string",
      label: "PDF Scale",
      description: "PDF render scale from `0.1` to `2`. Defaults to `1`.",
      optional: true,
    },
    geo: {
      type: "string",
      label: "Geo Country",
      description: "Two-letter country code (e.g. `US`, `DE`) to capture from via a geo-targeted proxy. Pro/Enterprise only.",
      optional: true,
    },
    geoCity: {
      type: "string",
      label: "Geo City",
      description: "City to target for the geo proxy. Pro/Enterprise only.",
      optional: true,
    },
    geoState: {
      type: "string",
      label: "Geo State",
      description: "State/region to target for the geo proxy. Pro/Enterprise only.",
      optional: true,
    },
    renderFullPage: {
      type: "boolean",
      label: "Render Full Page",
      description: "Capture (and diff) the entire scrollable page. Defaults to `true` for watches.",
      optional: true,
    },
    renderSelector: {
      type: "string",
      label: "Render Selector",
      description: "Monitor only the element matching this CSS selector instead of the whole page.",
      optional: true,
    },
    ignoreText: {
      type: "string[]",
      label: "Ignore Text",
      description: "Text patterns stripped from both captures before text-diffing so volatile substrings (timestamps, rotating prices, CSRF tokens) don't trigger a change. Wrap a pattern in `/…/flags` for a regex; anything else is a case-insensitive substring.",
      optional: true,
    },
    minTextChars: {
      type: "integer",
      label: "Minimum Text Change (chars)",
      description: "A text change must add and remove at least this many characters to count — drops micro-edits.",
      optional: true,
      min: 0,
      max: 100000,
    },
    suppressWhilePresent: {
      type: "string[]",
      label: "Suppress While Present",
      description: "While the page text contains any of these strings (e.g. `Out of stock`, `Loading`), the run is treated as unchanged — no alert, no baseline drift.",
      optional: true,
    },
    uaMode: {
      type: "string",
      label: "User-Agent Mode",
      description: "Fetch identity for the watch: `auto` (lead with the RendexWatch UA, retry once with a browser identity if blocked), `identify` (always the RendexWatch UA), or `stealth` (always a standard browser identity).",
      optional: true,
      options: [
        "auto",
        "identify",
        "stealth",
      ],
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
    getAccount(opts = {}) {
      return this._makeRequest({
        path: "/v1/account",
        ...opts,
      });
    },
    createArtifact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/artifact",
        ...opts,
      });
    },
  },
};
