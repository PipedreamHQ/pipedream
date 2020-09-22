const axios = require("axios");

const spotify = {
  type: "app",
  app: "spotify",
  methods: {
    async _getBaseUrl() {
      return "https://api.spotify.com/v1"
    },
    async _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async getPlaylistItems(playlist_id, params) {
      return await axios.get(
        `${await this._getBaseUrl()}/playlists/${playlist_id}/tracks`,
        {
          headers: await this._getHeaders(),
          params,
        }
      );
    },

    async getPlaylists(params) {
      return await axios.get(
        `${await this._getBaseUrl()}/me/playlists`, 
        {
          headers: await this._getHeaders(),
          params,
        }
      );
    },

    async getTracks(params) {
      return await axios.get(
        `${await this._getBaseUrl()}/me/tracks`, 
        {
          headers: await this._getHeaders(),
          params,
        }
      );
    },
  },
};

//const spotify = require("https://github.com/PipedreamHQ/pipedream/components/spotify/spotify.app.js");

module.exports = {
  name: "New Tracks in Playlist",
  description: "Emits an event for each new Spotify track added to a playlist.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    spotify,
    playlists: {
      type: "string[]",
      label: "Playlist",
      description: "Search for new tracks added to the specified playlist(s).",
      async options({ page, prevContext }) {
        const limit = 20;
        const offset = prevContext.offset ? prevContext.offset : 0;
        const results = await this.spotify.getPlaylists({ limit, offset });
        const options = results.data.items.map((playlist) => {
          return { label: playlist.name, value: playlist.id };
        });
        const newOffset = prevContext+limit;
        return {
          options,
          context: { newOffset },
        };
      },
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let results;
    let addedAt;
    let total = 1;
    let count = 0;
    let limit = 100;
    let offset = 0;

    const now = new Date();
    const monthAgo = new Date(now.getTime());
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    let lastEvent = this.db.get("lastEvent") || monthAgo;
    lastEvent = new Date(lastEvent);

    let params = {
      limit,
      offset,
    };

    for (playlistId of this.playlists) {
      let i = 0;
      params.offset = 0;
      while (count < total && i < total) {
        results = await this.spotify.getPlaylistItems(playlistId, params);
        total = results.data.total;
        for (const track of results.data.items) {
          addedAt = new Date(track.added_at);
          if (addedAt.getTime() > lastEvent.getTime()) {
            this.$emit(track, {
              id: track.track.id,
              summary: track.track.name,
              ts: track.added_at,
            });
          }
          count++;
        }
        i++;
        params.offset += limit;
      }
      count = 0;
      total = 1;
    }  

    this.db.set("lastEvent", now);
  },
};