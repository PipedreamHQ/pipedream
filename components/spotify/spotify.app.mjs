import { axios } from "@pipedream/platform";
import { promisify } from "util";
import {
  ITEM_TYPES,
  ITEM_TYPES_RESULT_NAME,
  PAGE_SIZE,
} from "./common/constants.mjs";
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
        const items = await this.getPlaylistItems({
          limit: PAGE_SIZE,
          offset: PAGE_SIZE * page,
          playlistId: playlistId.value ?? playlistId,
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
        const items = await this.getUserTracks({
          limit: PAGE_SIZE,
          offset: PAGE_SIZE * page,
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
        const artists = await this.getItems(
          ITEM_TYPES.ARTIST,
          query,
          PAGE_SIZE,
          PAGE_SIZE * page,
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
        const playlists = await this.getPlaylists({
          limit: PAGE_SIZE,
          offset: PAGE_SIZE * page,
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
        const categories = await this.getCategories({
          limit: PAGE_SIZE,
          offset: PAGE_SIZE * page,
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
        const tracks = await this.getItems(
          ITEM_TYPES.TRACK,
          query,
          PAGE_SIZE,
          PAGE_SIZE * page,
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
        const items = await this.getItems(
          [
            ITEM_TYPES.TRACK,
            ITEM_TYPES.EPISODE,
          ],
          query,
          PAGE_SIZE,
          PAGE_SIZE * page,
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
      if (Array.isArray(value)) {
        return value.map((item) => item.value ?? item);
      }

      // If is string, try to convert it in an array
      if (typeof value === "string") {
        // Return an empty array if string is empty
        if (value === "" || value.length === 0) {
          return [];
        }

        return value.replace(/["'[\]\s]+/g, "").split(",");
      }

      throw new Error(`${value} is not an array or an array-like`);
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _paginate(resourceFn, params = {}) {
      let data = [];
      params.limit = PAGE_SIZE;
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
    _getBaseUrl() {
      return "https://api.spotify.com/v1";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...args
    } = {}) {
      const config = {
        baseURL: this._getBaseUrl(),
        headers: {
          ...headers,
          ...this._getHeaders(),
        },
        ...args,
      };
      return await this.retry($, config);
    },
    // Retry axios request if not successful
    async retry($, config, retries = 3) {
      try {
        return await axios($, {
          ...config,
          returnFullResponse: true,
        });
      } catch (err) {
        if (retries <= 1) {
          throw new Error(err);
        }
        // if rate limit is exceeded, Retry-After will contain the # of seconds
        // to wait before retrying
        const delay = (err && err.status == 429)
          ? (err.headers["Retry-After"] * 1000)
          : 500;
        await pause(delay);
        return this.retry($, config, retries - 1);
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

      const res = await this._makeRequest({
        method: "GET",
        url: "/search",
        params,
      });
      return types.reduce((accumulator, type) => (
        accumulator.concat(res.data?.[ITEM_TYPES_RESULT_NAME[type]]?.items ?? [])
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
      $, playlistId, ...args
    }) {
      const res = await this._makeRequest({
        $,
        url: `/playlists/${playlistId}`,
        ...args,
      });
      return res.data ?? {};
    },
    async getPlaylists({
      $, ...args
    }) {
      const res = await this._makeRequest({
        $,
        url: "/me/playlists",
        ...args,
      });
      return res.data?.items ?? null;
    },
    async getCategories({
      $, ...args
    }) {
      const res = await this._makeRequest({
        $,
        url: "/browse/categories",
        ...args,
      });
      return res.data?.categories?.items ?? [];
    },
    async getUserTracks({
      $, ...args
    }) {
      const res = await this._makeRequest({
        $,
        url: "/me/tracks",
        ...args,
      });
      return res.data?.items ?? [];
    },
    async getPlaylistItems({
      $, playlistId, ...args
    }) {
      const res = await this._makeRequest({
        $,
        url: `/playlists/${playlistId}/tracks`,
        ...args,
      });
      return res.data?.items ?? [];
    },
    async getGenres({
      $, ...args
    } = {}) {
      const { data } = await this._makeRequest({
        $,
        url: "/recommendations/available-genre-seeds",
        ...args,
      });
      return data.genres;
    },
    async getRecommendations({
      $, ...args
    }) {
      const { data } = await this._makeRequest({
        $,
        url: "/recommendations",
        ...args,
      });
      return data;
    },
    async search({
      $, ...params
    }) {
      const { data } = await this._makeRequest({
        $,
        method: "GET",
        url: "/search",
        params,
      });
      return data;
    },
    async fetchChunksOfAlbumsIds({
      $,
      artistId,
      market,
    }) {
      const albums = [];
      let page = 0;
      let next = undefined;
      do {
        const { data } = await this._makeRequest({
          $,
          url: `/artists/${artistId.value ?? artistId}/albums`,
          params: {
            market,
            limit: PAGE_SIZE,
            offset: PAGE_SIZE * page,
            include_groups: "album,single",
          },
        });
        albums.push([
          ...data.items.map((album) => album.id),
        ]);
        next = data.next;
        page++;
      } while (next);
      return albums;
    },
    async getAllTracksByChunksOfAlbumIds({
      $,
      chunksOfAlbumIds,
      market,
    }) {
      const tracks = [];
      for (const albumIds of chunksOfAlbumIds) {
        const { data } = await this._makeRequest({
          $,
          url: "/albums",
          params: {
            market,
            ids: albumIds.join(","),
          },
        });
        tracks.push([
          ...data.albums.map((album) => album.tracks.items).flat(),
        ]);
      }
      return tracks.flat();
    },
  },
};
