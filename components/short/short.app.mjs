import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "short",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "Domain name you added to short.io",
      async options() {
        return this.listDomainsOpts(false);
      },
    },
    originalURL: {
      type: "string",
      label: "Original URL",
      description: "Link, which you want to shorten.",
    },
    domainId: {
      type: "string",
      label: "Domain Id",
      description: "Specify the domain id of your current short link.",
      async options() {
        return this.listDomainsOpts(true);
      },
    },
    link: {
      type: "string",
      label: "Link",
      description: "Specify your current short link.",
      async options({ domainId }) {
        if (domainId) {
          return this.listLinkOpts(domainId);
        }
        return [];
      },
    },
    path: {
      type: "string",
      label: "Path",
      description: "Optional path part of newly created link.\n\nIf empty - it will be generated automatically.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of created URL to be shown in short.io admin panel.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Specify the tags of your link.",
      optional: true,
    },
    allowDuplicates: {
      type: "boolean",
      label: "Allow duplicates",
      description: "Specify whether to allow repeated links to be registered.",
      optional: true,
    },
    expiresAt: {
      type: "integer",
      label: "Expires at",
      description: "Link expiration date, optional. Format is unix timestamp in milliseconds.\n\nIf no expiration date is given (default), link will never expire.",
      optional: true,
    },
    expiredURL: {
      type: "string",
      label: "Expired URL",
      description: "URL to redirect when the link is expired.",
      optional: true,
    },
    iphoneURL: {
      type: "string",
      label: "iPhone URL",
      description: "If users open the URL with iPhone, they will be redirected to this URL.",
      optional: true,
    },
    androidURL: {
      type: "string",
      label: "Android URL",
      description: "If users open the URL with Android, they will be redirected to this URL",
      optional: true,
    },
    password: {
      type: "string",
      label: "password",
      description: "Requires Personal plan. Password to be asked when user visits a link.\n\nThis password will not be stored in plain text, we will hash it with salt.",
      optional: true,
    },
    utmSource: {
      type: "string",
      label: "UTM Source",
      description: "The referrer: (e.g. google, newsletter).",
      optional: true,
    },
    utmMedium: {
      type: "string",
      label: "UTM Medium",
      description: "Marketing medium: (e.g. cpc, banner, email).",
      optional: true,
    },
    utmCampaign: {
      type: "string",
      label: "UTM Campaign",
      description: "Product, promo code, or slogan (e.g. spring_sale).",
      optional: true,
    },
    utmTerm: {
      type: "string",
      label: "UTM Term",
      description: "Identify the paid keywords.",
      optional: true,
    },
    utmContent: {
      type: "string",
      label: "UTM Content",
      description: "Use to differentiate ads.",
      optional: true,
    },
    cloaking: {
      type: "boolean",
      label: "Cloaking",
      description: "Specify whether to cloak the link.",
      optional: true,
    },
    redirectType: {
      type: "integer",
      label: "Redirect type",
      description: "Status for the short link redirect.",
      optional: true,
      options: [
        {
          label: "301 Moved Permanently",
          value: 301,
        },
        {
          label: "302 Found",
          value: 302,
        },
        {
          label: "303 See Other",
          value: 303,
        },
        {
          label: "307 Temporary Redirect",
          value: 307,
        },
        {
          label: "308 Permanent Redirect",
          value: 308,
        },
      ],
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.short.io";
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "Authorization": `${this.$auth.secret_key}`,
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    filterEmptyValues(obj) {
      return Object.entries(obj)
        .reduce((reduction,
          [
            key,
            value,
          ]) => {
          if (value === undefined || value === null) {
            return reduction;
          }
          return {
            ...reduction,
            [key]: value,
          };
        }, {});
    },
    async listDomainsOpts(withId) {
      const domains = await axios(this, this._getRequestParams({
        method: "GET",
        path: "/api/domains",
      }));
      if (Array.isArray(domains)) {
        const opts = domains.map((domain) => {
          if (withId) {
            return {
              label: domain.hostname,
              value: domain.id,
            };
          }
          return domain.hostname;
        });
        return opts;
      }
      return [];
    },
    async listLinkOpts(domainId) {
      const response = await axios(this, this._getRequestParams({
        method: "GET",
        path: `/api/links?domain_id=${domainId}&limit=150`,
      }));
      const opts = response.links.map((link) => ({
        label: link.secureShortURL,
        value: link.idString,
      }));
      return opts;
    },
    async createLink(ctx = this, param) {
      param = this.filterEmptyValues(param);
      const link = await axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/links",
        data: param,
      }));
      return link;
    },
    async updateLink(ctx = this, linkIdString, param) {
      param = this.filterEmptyValues(param);
      const link = await axios(ctx, this._getRequestParams({
        method: "POST",
        path: `/links/${linkIdString}`,
        data: param,
      }));
      return link;
    },
    async deleteLink(ctx = this, linkIdString) {
      const response = await axios(ctx, this._getRequestParams({
        method: "DELETE",
        path: `/links/${linkIdString}`,
      }));
      return response;
    },
  },
};
