import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "klipy",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Search Clips Props
    searchClipsQ: {
      type: "string",
      label: "Search Query for Clips",
      description: "The search keyword for finding relevant clips.",
    },
    searchClipsCustomerId: {
      type: "string",
      label: "Customer ID for Clips",
      description: "A unique user identifier in your system for clips.",
    },
    searchClipsLocale: {
      type: "string",
      label: "Locale for Clips",
      description: "Country code / language of the customer (ISO 3166 Alpha-2)",
      optional: true,
    },
    // View Clips Props
    viewClipsSlug: {
      type: "string",
      label: "Slug for Viewing Clips",
      description: "The slug of the clip to trigger the view action.",
    },
    viewClipsCustomerId: {
      type: "string",
      label: "Customer ID for Viewing Clips",
      description: "A unique user identifier in your system for viewing clips.",
    },
    // Search GIFs Props
    searchGifsQ: {
      type: "string",
      label: "Search Query for GIFs",
      description: "The search keyword for finding relevant GIFs.",
    },
    searchGifsCustomerId: {
      type: "string",
      label: "Customer ID for GIFs",
      description: "A unique user identifier in your system for GIFs.",
    },
    searchGifsLocale: {
      type: "string",
      label: "Locale for GIFs",
      description: "Country code / language of the customer (ISO 3166 Alpha-2)",
      optional: true,
    },
    // View GIFs Props
    viewGifsSlug: {
      type: "string",
      label: "Slug for Viewing GIFs",
      description: "The slug of the GIF to trigger the view action.",
    },
    viewGifsCustomerId: {
      type: "string",
      label: "Customer ID for Viewing GIFs",
      description: "A unique user identifier in your system for viewing GIFs.",
    },
    // Search Stickers Props
    searchStickersQ: {
      type: "string",
      label: "Search Query for Stickers",
      description: "The search keyword for finding relevant stickers.",
    },
    searchStickersCustomerId: {
      type: "string",
      label: "Customer ID for Stickers",
      description: "A unique user identifier in your system for stickers.",
    },
    searchStickersLocale: {
      type: "string",
      label: "Locale for Stickers",
      description: "Country code / language of the customer (ISO 3166 Alpha-2)",
      optional: true,
    },
    // View Stickers Props
    viewStickersSlug: {
      type: "string",
      label: "Slug for Viewing Stickers",
      description: "The slug of the sticker to trigger the view action.",
    },
    viewStickersCustomerId: {
      type: "string",
      label: "Customer ID for Viewing Stickers",
      description: "A unique user identifier in your system for viewing stickers.",
    },
  },
  methods: {
    // Log authentication keys
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    // Base URL for Klipy API
    _baseUrl() {
      return "https://api.klipy.com";
    },
    // Make an HTTP request using axios
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers = {},
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.app_key}`,
        },
        ...otherOpts,
      });
    },
    // Search Clips
    async searchClips(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/api/v1/clips/search",
        params: {
          q: this.searchClipsQ,
          customer_id: this.searchClipsCustomerId,
          locale: this.searchClipsLocale,
          page: opts.page || 1,
          per_page: opts.perPage || 24,
        },
      });
    },
    // View Clip
    async viewClips(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/api/v1/clips/view/${this.viewClipsSlug}`,
        data: {
          customer_id: this.viewClipsCustomerId,
        },
      });
    },
    // Search GIFs
    async searchGifs(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/api/v1/gifs/search",
        params: {
          q: this.searchGifsQ,
          customer_id: this.searchGifsCustomerId,
          locale: this.searchGifsLocale,
          page: opts.page || 1,
          per_page: opts.perPage || 24,
        },
      });
    },
    // View GIF
    async viewGifs(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/api/v1/gifs/view/${this.viewGifsSlug}`,
        data: {
          customer_id: this.viewGifsCustomerId,
        },
      });
    },
    // Search Stickers
    async searchStickers(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/api/v1/stickers/search",
        params: {
          q: this.searchStickersQ,
          customer_id: this.searchStickersCustomerId,
          locale: this.searchStickersLocale,
          page: opts.page || 1,
          per_page: opts.perPage || 24,
        },
      });
    },
    // View Sticker
    async viewStickers(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/api/v1/stickers/view/${this.viewStickersSlug}`,
        data: {
          customer_id: this.viewStickersCustomerId,
        },
      });
    },
    // Pagination Method
    async paginate(fn, ...opts) {
      let results = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fn({
          ...opts,
          page,
        });
        if (!response || response.length === 0) {
          hasMore = false;
        } else {
          results.push(...response);
          page += 1;
          if (response.length < 24) { // assuming per_page default is 24
            hasMore = false;
          }
        }
      }

      return results;
    },
  },
};
