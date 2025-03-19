import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "klipy",
  propDefinitions: {
    q: {
      type: "string",
      label: "Search Query",
      description: "The search keyword for finding relevant clips.",
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "A unique user identifier in your system for clips.",
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Country code / language of the customer (ISO 3166 Alpha-2)",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The requested page number.",
      default: 1,
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "The slug of the clip.",
    },
  },
  methods: {
    _baseUrl() {
      return `https://api.klipy.co/api/v1/${this.$auth.app_key}`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        ...opts,
      });
    },
    search({
      model, slug = "search", ...opts
    }) {
      return this._makeRequest({
        path: `/${model}/${slug}`,
        ...opts,
      });
    },
  },
};
