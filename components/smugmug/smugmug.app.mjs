import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "smugmug",
  propDefinitions: {
    album: {
      type: "string",
      label: "Album Key",
      description: "Album Key of the album to retrieve",
      async options({ page }) {
        const uri = await this.getAuthenticatedUserUri();
        const count = constants.DEFAULT_PAGE_SIZE;
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
    image: {
      type: "string",
      label: "Image Key",
      description: "Image Key of the image to retrieve",
      async options({ page }) {
        const uri = await this.getAuthenticatedUserUri();
        const count = constants.DEFAULT_PAGE_SIZE;
        const params = {
          Scope: uri,
          count,
          start: (page - 1) * count,
        };
        const response = await this.searchImages({
          params,
        });
        const images = response?.Response?.Image;
        return images?.length > 0
          ? images.map((image) => ({
            label: image.FileName,
            value: image.ImageKey,
          }))
          : [];
      },
    },
    folder: {
      type: "string",
      label: "Folder",
      description: "Folder where the new album will be created",
      async options({ page }) {
        const uri = await this.getAuthenticatedUserUri();
        const nickname = await this.getAuthenticatedUserNickname();
        const count = constants.DEFAULT_PAGE_SIZE;
        const params = {
          Scope: uri,
          count,
          start: (page - 1) * count,
        };
        const response = await this.listFolders(nickname, {
          params,
        });
        const folders = response?.Response?.Folder;
        return folders?.length > 0
          ? folders.map((folder) => ({
            label: folder.Name,
            value: folder.UrlName,
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
      const signature = this._signature();
      return axios($, config, signature);
    },
    async getAuthenticatedUserUri() {
      const user = await this.getAuthenticatedUser();
      return user?.Response?.User?.Uri;
    },
    async getAuthenticatedUserNickname() {
      const user = await this.getAuthenticatedUser();
      return user?.Response?.User?.NickName;
    },
    async getAuthenticatedUserRefTag() {
      const user = await this.getAuthenticatedUser();
      return user?.Response?.User?.RefTag;
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
    async createAlbum(nickname, folder, args = {}) {
      return this._makeRequest({
        path: `/folder/user/${nickname}/${folder}!albums`,
        method: "POST",
        ...args,
      });
    },
    async getImage(imageKey, args = {}) {
      return this._makeRequest({
        path: `/image/${imageKey}`,
        ...args,
      });
    },
    async searchImages(args = {}) {
      return this._makeRequest({
        path: "/image!search",
        ...args,
      });
    },
    async getUserProfile(nickname, args = {}) {
      return this._makeRequest({
        path: `/user/${nickname}!profile`,
        ...args,
      });
    },
    async listFolders(nickname, args = {}) {
      return this._makeRequest({
        path: `/folder/user/${nickname}!folders`,
        ...args,
      });
    },
  },
};
