import { axios } from "@pipedream/platform";
import options from "./common/enums.mjs";

export default {
  type: "app",
  app: "papyrs",
  propDefinitions: {
    subsite: {
      type: "string",
      label: "Subsite",
      description: "The subsite to use for this action. If you don't fill this in, the default subsite will be used.",
      optional: true,
    },
    page: {
      type: "string",
      label: "Page",
      description: "The page to use for this action.",
      async options() {
        const data = await this.getAllPages();
        return data.map((page) => ({
          label: page.title,
          value: page.id,
        }));
      },
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the text box. Defaults to `html`.",
      options: options.CREATE_PARAGRAPH_HEADING_FORMAT,
      optional: true,
    },
  },
  methods: {
    _getBaseUrl(subsite = "home") {
      return `https://${this._getSiteName()}.papyrs.com/@${subsite}/api/v1`;
    },
    _getApiToken() {
      return this.$auth.api_token;
    },
    _getSiteName() {
      return this.$auth.site_name;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        "X-Auth-Token": this._getApiToken(),
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        params: {
          ...opts.params,
          auth_token: this._getApiToken(),
        },
      };
      return axios(ctx, axiosOpts);
    },
    async getAllPages(subsite, ctx = this) {
      return this._makeHttpRequest(
        {
          path: "/pages/all/",
          method: "GET",
          subsite,
        },
        ctx,
      );
    },
    async createParagraph(data, pageId, subsite, ctx = this) {
      return this._makeHttpRequest(
        {
          path: `/page/${pageId}/paragraph/create/`,
          method: "POST",
          data,
          subsite,
        },
        ctx,
      );
    },
    async createHeading(data, pageId, subsite, ctx = this) {
      return this._makeHttpRequest(
        {
          path: `/page/${pageId}/heading/create/`,
          method: "POST",
          data,
          subsite,
        },
        ctx,
      );
    },
  },
};
