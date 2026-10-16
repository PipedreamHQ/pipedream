import { axios } from "@pipedream/platform";
import { HtmlCssToImageClient } from "@html-css-to-image/client";
import { propDefinitions } from "./common/generated-props.mjs";
import { validateDownloadInput } from "./common/files.mjs";

export default {
  type: "app",
  app: "html_css_to_image",
  propDefinitions,
  methods: {
    /** Build the official client's signing helpers with the connected account's credentials. */
    _getSigningClient() {
      return new HtmlCssToImageClient(this.$auth.user_id, this.$auth.api_key);
    },
    /**
     * Generate a template URL locally without requesting rendering.
     * @param {object} request Template ID, optional version, values, and format.
     * @returns {string} Signed image URL.
     */
    generateSignedUrlForTemplate(request) {
      return this._getSigningClient().generateTemplatedImageUrl(request);
    },
    /**
     * Generate a webpage screenshot URL locally without requesting rendering.
     * @param {object} request Webpage URL and supported rendering options.
     * @returns {string} Signed screenshot URL.
     */
    generateSignedUrlForWebpage(request) {
      return this._getSigningClient().generateCreateAndRenderUrl(request);
    },
    /** Return the base URL for authenticated API requests. */
    _getBaseUrl() {
      return "https://hcti.io/v1";
    },
    /** Encode the connected account's credentials for HTTP Basic authentication. */
    _getAuth() {
      const basicAuth = Buffer.from(`${this.$auth.user_id}:${this.$auth.api_key}`).toString("base64");
      return `Basic ${basicAuth}`;
    },
    /** Return authentication and JSON content headers for API requests. */
    _getHeaders() {
      return {
        "content-type": "application/json",
        "Authorization": this._getAuth(),
      };
    },
    /** Combine request options with the API URL and connected account's headers. */
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    /** Send an authenticated API request through Pipedream's HTTP helper. */
    async _makeRequest(ctx, opts) {
      return axios(ctx, this._getRequestParams(opts));
    },
    /**
     * Create a webpage screenshot and return the API response with its ID and URL.
     * @param {object} ctx Pipedream execution context.
     * @param {string} url Webpage to capture.
     * @param {object} options Optional API rendering parameters.
     */
    async createImageFromURL(ctx = this, url, options = {}) {
      return this._makeRequest(ctx, {
        method: "POST",
        path: "/image",
        data: {
          ...options,
          url,
        },
      });
    },
    /**
     * Create an image from HTML/CSS and return the API response with its ID and URL.
     * @param {object} ctx Pipedream execution context.
     * @param {string} html HTML snippet or document.
     * @param {string} css Optional stylesheet.
     * @param {object} options Optional API rendering parameters.
     */
    async createImageFromHTML(ctx = this, html, css, options = {}) {
      return this._makeRequest(ctx, {
        method: "POST",
        path: "/image",
        data: {
          ...options,
          html,
          css,
        },
      });
    },
    /**
     * Render a saved template using its ID and optional version in the endpoint path.
     * @param {object} ctx Pipedream execution context.
     * @param {object} request Template ID, optional version, values, and rendering options.
     */
    async createImageFromTemplate(ctx = this, {
      template_id: templateId,
      template_version: templateVersion,
      ...data
    }) {
      const versionPath = templateVersion == null
        ? ""
        : `/${encodeURIComponent(templateVersion)}`;
      return this._makeRequest(ctx, {
        method: "POST",
        path: `/image/${encodeURIComponent(templateId)}${versionPath}`,
        data,
      });
    },
    /**
     * Retrieve one template page, including the cursor for the next page.
     * @param {object} ctx Pipedream execution context.
     * @param {object} params Page size (count) and optional cursor (max_version).
     */
    async listTemplates(ctx = this, params) {
      return this._makeRequest(ctx, {
        method: "GET",
        path: "/template",
        params,
      });
    },
    /**
     * Request permanent deletion of an image and its cached copies.
     * @param {object} ctx Pipedream execution context.
     * @param {string} imageId Image ID returned by a creation action.
     */
    async deleteImage(ctx = this, imageId) {
      return this._makeRequest(ctx, {
        method: "DELETE",
        path: `/image/${encodeURIComponent(imageId)}`,
      });
    },
    /**
     * Fetch a file as a stream without sending the connected account's API credentials.
     * @param {object} ctx Pipedream execution context.
     * @param {string} imageUrl Image or PDF URL, including any signed query string.
     * @param {object} opts Optional HTTP client settings.
     * @returns {Promise<object>} Full HTTP response with a readable data stream.
     */
    async downloadImage(ctx = this, imageUrl, opts = {}) {
      validateDownloadInput(imageUrl);
      const url = new URL(imageUrl);
      return axios(ctx, {
        ...opts,
        method: "GET",
        url: `${url.origin}${url.pathname}`,
        params: {},
        // Platform axios extracts and rewrites query parameters from URLs.
        // Preserve the exact encoded query, including repeated header entries,
        // so the HMAC of a signed URL remains valid on the wire.
        paramsSerializer: () => url.search.slice(1),
        beforeRedirect: (options) => {
          const port = options.port
            ? `:${options.port}`
            : "";
          const credentials = options.auth
            ? `${options.auth}@`
            : "";
          validateDownloadInput(`${options.protocol}//${credentials}${options.hostname}${port}/`);
        },
        responseType: "stream",
        returnFullResponse: true,
      });
    },
  },
};
