import { axios } from "@pipedream/platform";
import { HtmlCssToImageClient } from "@html-css-to-image/client";
import { propDefinitions } from "./common/generated-props.mjs";

export default {
  type: "app",
  app: "html_css_to_image",
  propDefinitions,
  methods: {
    _getSigningClient() {
      return new HtmlCssToImageClient(this.$auth.user_id, this.$auth.api_key);
    },
    generateSignedUrlForTemplate(request) {
      return this._getSigningClient().generateTemplatedImageUrl(request);
    },
    generateSignedUrlForWebpage(request) {
      return this._getSigningClient().generateCreateAndRenderUrl(request);
    },
    _getBaseUrl() {
      return "https://hcti.io/v1";
    },
    _getAuth() {
      const basicAuth = Buffer.from(`${this.$auth.user_id}:${this.$auth.api_key}`).toString("base64");
      return `Basic ${basicAuth}`;
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "Authorization": this._getAuth(),
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async _makeRequest(ctx, opts) {
      return axios(ctx, this._getRequestParams(opts));
    },
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
    async listTemplates(ctx = this, params) {
      return this._makeRequest(ctx, {
        method: "GET",
        path: "/template",
        params,
      });
    },
    async deleteImage(ctx = this, imageId) {
      return this._makeRequest(ctx, {
        method: "DELETE",
        path: `/image/${encodeURIComponent(imageId)}`,
      });
    },
    async downloadImage(ctx = this, imageUrl, opts = {}) {
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
        responseType: "stream",
        returnFullResponse: true,
      });
    },
  },
};
