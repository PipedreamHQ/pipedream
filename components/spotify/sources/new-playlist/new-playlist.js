const spotify = require("../../spotify.app.js");

module.exports = {
  key: "spotify-new-playlist",
  name: "New Playlist",
  description:
    "Emit an event when a new playlist is created or followed by the current Spotify user.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    spotify,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let results;
    let total = 1;
    let count = 0;
    let limit = 20;
    let offset = 0;

    let params = {
      limit,
      offset,
    };

    while (count < total) {
      results = await this.spotify.getPlaylists(params);
      total = results.data.total;
      for (const playlist of results.data.items) {
        this.$emit(playlist, {
          id: playlist.id,
          summary: playlist.name,
          ts: Date.now(),
        });
        count++;
      }
      params.offset += limit;
    }
  },
};