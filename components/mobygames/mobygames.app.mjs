import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mobygames",
  propDefinitions: {
    genreId: {
      type: "string",
      label: "Genre",
      description: "Select a genre to filter games",
      async options() {
        const genres = await this.getGenres();
        return genres.map((genre) => ({
          label: genre.genre_name,
          value: genre.genre_id.toString(),
        }));
      },
    },
    platformId: {
      type: "string",
      label: "Platform",
      description: "Select a platform to filter games",
      async options() {
        const platforms = await this.getPlatforms();
        return platforms.map((platform) => ({
          label: platform.platform_name,
          value: platform.platform_id.toString(),
        }));
      },
    },
    queryParams: {
      type: "object",
      label: "Query Parameters",
      description: "Additional query parameters to filter games",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.mobygames.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        params,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getGenres() {
      return this._makeRequest({
        path: "/genres",
      });
    },
    async getPlatforms() {
      return this._makeRequest({
        path: "/platforms",
      });
    },
    async getGames({
      genreId, platformId, queryParams,
    }) {
      return this._makeRequest({
        path: "/games",
        params: {
          genre: genreId,
          platform: platformId,
          ...queryParams,
        },
      });
    },
  },
  version: `0.0.${new Date().getTime()}`,
};
