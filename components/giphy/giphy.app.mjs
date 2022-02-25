import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "giphy",
  propDefinitions: {
    max: {
      type: "integer",
      label: "Max",
      description: "The maximum amount of registers to be fetched. Defaults to `50`",
      min: 1,
      default: 50,
      optional: true,
    },
  },
  methods: {
    _getAxiosParams(opts = {}) {
      return {
        ...opts,
        params: {
          ...opts.params,
          api_key: this.$auth.api_key,
        },
      };
    },
    async getGifsOrStickers(searchType, params, max, ctx = this) {
      const TOTAL_LIMIT = max || 50;
      const DEFAULT_LIMIT_PER_PAGE = 50;

      let items = [];
      let limit = Math.min(DEFAULT_LIMIT_PER_PAGE, parseInt(TOTAL_LIMIT));
      let currentPage = 0;
      do {
        // Adjust the limit to avoid extra elements on the last page
        if (items.length + limit > TOTAL_LIMIT) {
          limit -= items.length + limit - TOTAL_LIMIT;
        }
        const res = await axios(ctx, this._getAxiosParams({
          method: "GET",
          url: searchType === "gifs"
            ? "https://api.giphy.com/v1/gifs/search"
            : "https://api.giphy.com/v1/stickers/search",
          params: {
            ...params,
            limit,
            offset: currentPage * DEFAULT_LIMIT_PER_PAGE,
          },
        }));

        if (res.data?.length > 0) {
          items = [
            ...items,
            ...res.data,
          ];
        } else {
          break;
        }
      } while (items.length < TOTAL_LIMIT);

      return items;
    },
    async translateTerm(searchType, params, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "GET",
        path: searchType === "gifs"
          ? "https://api.giphy.com/v1/gifs/translate"
          : "https://api.giphy.com/v1/stickers/translate",
        params,
      }));
    },
    async uploadGif(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        headers: data.getHeaders(),
        method: "POST",
        url: "https://upload.giphy.com/v1/gifs",
        data,
      }));
    },
  },
};
