import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smugmug",
  propDefinitions: {
    album: {
      type: "string",
      label: "Album Key",
      description: "Album Key of the album to retrieve",
      async options({ page }) {
        const user = await this.getAuthenticatedUser();
        const uri = user.Response.User.Uri;
        const count = 10;
        const params = {
          Scope: uri,
          count,
          start: (page - 1) * count,
        };
        const response = await this.searchAlbums({
          params,
        });
        const albums = response?.Response?.Album;
        return albums?.length > 0
          ? albums.map((album) => ({
            label: album.Name,
            value: album.AlbumKey,
          }))
          : [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.smugmug.com/api/v2";
    },
    _headers() {
      return {
        Accept: "application/json",
      };
    },
    _signature() {
      return {
        token: {
          key: this.$auth.oauth_access_token,
          secret: this.$auth.oauth_refresh_token,
        },
        oauthSignerUri: this.$auth.oauth_signer_uri,
      };
    },
    async _makeRequest(args = {}) {
      const {
        $ = this,
        path,
        ...otherArgs
      } = args;
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...otherArgs,
      };
      const signature = this._signature(); console.log(config);
      return axios($, config, signature);
    },
    async getAuthenticatedUser(args = {}) {
      return this._makeRequest({
        path: "!authuser",
        ...args,
      });
    },
    async getAlbum(albumKey, args = {}) {
      return this._makeRequest({
        path: `/album/${albumKey}`,
        ...args,
      });
    },
    async searchAlbums(args = {}) {
      return this._makeRequest({
        path: "/album!search",
        ...args,
      });
    },
  },
};
