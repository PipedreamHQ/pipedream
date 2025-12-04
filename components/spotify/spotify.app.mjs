import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import isArray from "lodash/isArray.js";
import isEmpty from "lodash/isEmpty.js";
import isNil from "lodash/isNil.js";
import isString from "lodash/isString.js";
import { promisify } from "util";
import {
  ITEM_TYPES,
  ITEM_TYPES_RESULT_NAME,
} from "./consts.mjs";
import Countries from "./country-codes.mjs";

const pause = promisify((delay, fn) => setTimeout(fn, delay));

export default {
  type: "app",
  app: "spotify",
  propDefinitions: {
    market: {
      type: "string",
      label: "Market",
      description: "Type to search for a country or enter a custom expression to specify the [ISO 3166-1 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).",
      options: Countries,
    },
    playlistTracksUris: {
      type: "string[]",
      label: "Tracks",
      description: "Select tracks or episodes to remove, or enter a custom expression to reference specific [Spotify URIs](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) (for example, `spotify:track:4iV5W9uYEdYUVa79Axb7Rh, spotify:episode:512ojhOuo1ktJprKbVcKyQ`). A maximum of 100 URIs can be sent at once.",
      withLabel: true,
      async options({
        page, playlistId,
      }) {
        const limit = 20;
        const items = await this.getPlaylistItems({
          limit,
          offset: limit * page,
          playlistId: get(playlistId, "value", playlistId),
        });

        return {
          options: items.map((item) => ({
            label: this.getItemOptionLabel(item.track),
            value: item.track.uri,
          })),
        };
      },
    },
    savedUserTracksId: {
      type: "string[]",
      label: "Track ID",
      description: "Search saved user tracks in \"Liked Songs\" or enter a custom expression to reference specific [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the track. For example: `4iV5W9uYEdYUVa79Axb7Rh`. Maximum: 50 IDs.",
      withLabel: true,
      async options({ page }) {
        const limit = 20;
        const items = await this.getUserTracks({
          limit,
          offset: limit * page,
        });

        return {
          options: items.map((item) => ({
            label: this.getItemOptionLabel(item.track),
            value: item.track.id,
          })),
        };
      },
    },
    artistId: {
      type: "string",
      label: "Artist ID",
      description: "Type to search for any artist on Spotify or enter a custom expression to specify an artist's [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) (for example, `43ZHCT0cAZBISjO8DG9PnE`).",
      useQuery: true,
      withLabel: true,
      async options({
        query,
        page,
      }) {
        const limit = 20;
        const artists = await this.getItems(
          ITEM_TYPES.ARTIST,
          query,
          limit,
          limit * page,
        );
        return {
          options: artists.map((artist) => ({
            label: artist.name,
            value: artist.id,
          })),
        };
      },
    },
    playlistId: {
      type: "string",
      label: "Playlist ID",
      description: "Select an existing playlist or pass a custom expression to reference a specific [`playlist_id`](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) (for example, `3cEYpjA9oz9GiPac4AsH4n`).",
      async options({ page }) {
        const limit = 20;
        const playlists = await this.getPlaylists({
          limit,
          offset: limit * page,
        });
        return {
          options: playlists.map((playlist) => ({
            label: playlist.name,
            value: playlist.id,
          })),
        };
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "Type to search for a category or enter a custom expression to reference a specific [category ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) (for example, `party`).",
      withLabel: true,
      async options({ page }) {
        const limit = 20;
        const categories = await this.getCategories({
          limit,
          offset: limit * page,
        });
        return {
          options: categories.map((category) => ({
            label: category.name,
            value: category.id,
          })),
        };
      },
    },
    trackId: {
      type: "string",
      label: "Track ID",
      description: "Type to search for any track or artist on Spotify, or enter a custom expression to reference a specific [track ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) (for example, `4iV5W9uYEdYUVa79Axb7Rh`).",
      useQuery: true,
      withLabel: true,
      async options({
        query,
        page,
      }) {
        const limit = 20;
        const tracks = await this.getItems(
          ITEM_TYPES.TRACK,
          query,
          limit,
          limit * page,
        );
        return {
          options: tracks.map((track) => ({
            label: this.getItemOptionLabel(track),
            value: track.id,
          })),
        };
      },
    },
    uris: {
      type: "string[]",
      label: "Track or Episode URIs",
      description: "Type to search for any tracks or episodes on Spotify, or enter a custom expression to reference specific [track or episode URIs](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) (for example, `spotify:track:4iV5W9uYEdYUVa79Axb7Rh, spotify:episode:512ojhOuo1ktJprKbVcKyQ`). A maximum of 100 items can be added in one request.",
      useQuery: true,
      withLabel: true,
      async options({
        query,
        page,
      }) {
        const limit = 20;
        const items = await this.getItems(
          [
            ITEM_TYPES.TRACK,
            ITEM_TYPES.EPISODE,
          ],
          query,
          limit,
          limit * page,
        );
        return {
          options: items.map((item) => ({
            label: this.getItemOptionLabel(item),
            value: item.uri,
          })),
        };
      },
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The index of the first item to return. Default: 0 (the first object). Use with `limit` to get the next set of items.",
      optional: true,
      min: 0,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of items to return. The default is 100.",
      optional: true,
      min: 1,
      max: 100,
    },
    genres: {
      type: "string[]",
      label: "Seed Genres",
      description: "An array of genres. Up to 5 seed values may be provided in any combination of `seedArtists`, `seedTracks` and `seedGenres`.",
      async options() {
        return this.getGenres();
      },
    },
  },
  methods: {
    sanitizedArray(value) {
      if (isArray(value)) {
        return value.map((item) => get(item, "value", item));
      }

      // If is string, try to convert it in an array
      if (isString(value)) {
        // Return an empty array if string is empty
        if (isEmpty(value)) {
          return [];
        }

        return value.replace(/["'[\]\s]+/g, "").split(",");
      }

      throw new Error(`${value} is not an array or an array-like`);
    },
    _getAxiosParams(opts) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path + this._getQuery(opts.params),
        headers: this._getHeaders(),
      };
    },
    _getBaseUrl() {
      return "https://api.spotify.com/v1";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getQuery(params) {
      if (!params) {
        return "";
      }

      let query = "?";
      const keys = Object.keys(params);
      for (let i = 0; i < keys.length; i++) {
        // Explicity looking for nil values to avoid false negative for Boolean(false)
        if (!isNil(params[keys[i]])) {
          query += `${keys[i]}=${params[keys[i]]}&`;
        }
      }

      // It removes the last string char, it can be ? or &
      return query.substr(0, query.length - 1);
    },
    async _paginate(resourceFn, params = {}) {
      let data = [];
      params.limit = 20;
      params.offset = 0;

      do {
        const items = await resourceFn(params);
        data = [
          ...data,
          ...items,
        ];

        if (items.length < params.limit) {
          break;
        }

        params.offset += params.limit;
      } while (true);

      return data;
    },
    getTrackNameWithArtists(track) {
      if (!track) {
        return "";
      }

      if (!track.artists || !track.artists[0]) {
        return `${track.name} [Unknown Artist]`;
      }

      const artists = track.artists.map((artist) => artist.name).join(", ");
      return `${track.name} [${artists}]`;
    },
    async _makeRequest(method, endpoint, params) {
      const config = {
        method,
        url: `${await this._getBaseUrl()}${endpoint}`,
        headers: await this._getHeaders(),
        params,
      };
      return await this.retry(config);
    },
    // Retry axios request if not successful
    async retry(config, retries = 3) {
      let response;
      try {
        return await axios(this, {
          ...config,
          returnFullResponse: true,
        });
      } catch (err) {
        if (retries <= 1) {
          throw new Error(err);
        }
        // if rate limit is exceeded, Retry-After will contain the # of seconds
        // to wait before retrying
        const delay = (response && response.status == 429)
          ? (response.headers["Retry-After"] * 1000)
          : 500;
        await pause(delay);
        return this.retry(config, retries - 1);
      }
    },
    async getItems(types, q, limit, offset) {
      if (!Array.isArray(types)) {
        types = [
          types,
        ];
      }
      for (const type of types) {
        if (!Object.values(ITEM_TYPES).includes(type)) {
          throw new Error("Invalid item type");
        }
      }
      if (!q) {
        return [];
      }

      const params = {
        type: types.join(","),
        q,
        limit,
        offset,
      };

      const res = await this._makeRequest("GET", "/search", params);
      return types.reduce((accumulator, type) => (
        accumulator.concat(get(res, `data.${ITEM_TYPES_RESULT_NAME[type]}.items`, []))
      ), []);
    },
    getItemOptionLabel(item) {
      switch (item.type) {
      case ITEM_TYPES.TRACK:
        return this.getTrackNameWithArtists(item);
      case ITEM_TYPES.EPISODE:
        return `${item.name}`;
      default:
        return item.name;
      }
    },
    async getPlaylist({
      playlistId, params,
    }) {
      const res = await this._makeRequest("GET", `/playlists/${playlistId}`, params);
      return get(res, "data", {});
    },
    async getPlaylists(params) {
      const res = await this._makeRequest("GET", "/me/playlists", params);
      return get(res, "data.items", null);
    },
    async getCategories(params) {
      const res = await this._makeRequest("GET", "/browse/categories", params);
      return get(res, "data.categories.items", []);
    },
    async getUserTracks(params) {
      const res = await this._makeRequest("GET", "/me/tracks", params);
      return get(res, "data.items", []);
    },
    async getPlaylistItems(params) {
      const { playlistId } = params;
      const res = await this._makeRequest("GET", `/playlists/${playlistId}/tracks`, params);
      return get(res, "data.items", []);
    },
    async getGenres() {
      const { data } = await this._makeRequest("GET", "/recommendations/available-genre-seeds");
      return data.genres;
    },
    async getRecommendations(params) {
      const { data } = await this._makeRequest("GET", "/recommendations", params);
      return data;
    },
    async search(params) {
      const { data } = await this._makeRequest("GET", "/search", params);
      return data;
    },
    async fetchChunksOfAlbumsIds({
      artistId,
      market,
    }) {
      const albums = [];
      const limit = 20;
      let page = 0;
      let next = undefined;
      do {
        const { data } = await this._makeRequest(
          "GET",
          `/artists/${get(artistId, "value", artistId)}/albums`,
          {
            market,
            limit,
            offset: limit * page,
            include_groups: "album,single",
          },
        );
        albums.push([
          ...data.items.map((album) => album.id),
        ]);
        next = data.next;
        page++;
      } while (next);
      return albums;
    },
    async getAllTracksByChunksOfAlbumIds({
      chunksOfAlbumIds,
      market,
    }) {
      const tracks = [];
      for (const albumIds of chunksOfAlbumIds) {
        const { data } = await this._makeRequest(
          "GET",
          "/albums",
          {
            market,
            ids: albumIds.join(","),
          },
        );
        tracks.push([
          ...data.albums.map((album) => album.tracks.items).flat(),
        ]);
      }
      return tracks.flat();
    },
  },
};
