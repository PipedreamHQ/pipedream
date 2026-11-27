import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sell_to_state",
  propDefinitions: {
    q: {
      type: "string",
      label: "Text",
      description: "Words to search, at most 120 characters. Example: `payroll software`.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country slug, or slugs separated by commas, for example `united-kingdom,ireland`. Empty means all countries. [See the countries](https://selltostate.com/countries/)",
      optional: true,
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "The `slug` of a search result.",
    },
    entityCountry: {
      type: "string",
      label: "Country",
      description: "The country slug of the search result, for example `united-kingdom`.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Results to return, 1 to 50.",
      min: 1,
      max: 50,
      default: 25,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.selltostate.com/api/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    search({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/search",
        params,
      });
    },
    getBuyer({
      $, slug, country,
    }) {
      return this._makeRequest({
        $,
        path: `/buyers/${encodeURIComponent(slug)}`,
        params: {
          country,
        },
      });
    },
    getSupplier({
      $, slug, country,
    }) {
      return this._makeRequest({
        $,
        path: `/suppliers/${encodeURIComponent(slug)}`,
        params: {
          country,
        },
      });
    },
  },
};
