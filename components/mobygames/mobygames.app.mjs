import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mobygames",
  propDefinitions: {
    platform: {
      type: "string",
      label: "Platform ID",
      description: "The ID of a platform on which the game was released",
      optional: true,
      async options() {
        const { platforms } = await this.getPlatforms();

        return platforms.map(({
          platform_id, platform_name,
        }) => ({
          label: platform_name,
          value: platform_id,
        }));
      },
    },
    genre: {
      type: "string",
      label: "Genre ID",
      description: "The ID of a genre assigned to the game",
      optional: true,
      async options() {
        const { genres } = await this.getGenres();

        return genres.map(({
          genre_id, genre_name,
        }) => ({
          label: genre_name,
          value: genre_id,
        }));
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the game",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.mobygames.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          ...params,
          api_key: this.$auth.api_key,
        },
      });
    },
    async getGenres(args = {}) {
      return this._makeRequest({
        path: "/genres",
        ...args,
      });
    },
    async getPlatforms(args = {}) {
      return this._makeRequest({
        path: "/platforms",
        ...args,
      });
    },
    async getGames(args = {}) {
      return this._makeRequest({
        path: "/games",
        ...args,
      });
    },
  },
};
