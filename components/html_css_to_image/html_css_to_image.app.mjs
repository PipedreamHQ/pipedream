import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "html_css_to_image",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The fully qualified URL to a public webpage. Such as `https://htmlcsstoimage.com`.",
    },
    html: {
      type: "string",
      label: "HTML",
      description: "This is the HTML you want to render.\n\nYou can send an HTML snippet `<div>Your content</div>` or an entire webpage.",
    },
    css: {
      type: "string",
      label: "CSS",
      description: "The CSS for your image. it will be injected into the HTML.",
      optional: true,
    },
  },
  methods: {
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
    async createImageFromURL(ctx = this, url) {
      return axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/image",
        data: {
          url,
        },
      }));
    },
    async createImageFromHTML(ctx = this, html, css) {
      return axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/image",
        data: {
          html,
          css,
        },
      }));
    },
  },
};
