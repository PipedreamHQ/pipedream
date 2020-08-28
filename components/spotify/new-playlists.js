const spotify = require("https://github.com/PipedreamHQ/pipedream/components/spotify/spotify.app.js");

module.exports = {
  name: "New Playlists",
  description:
    "Emits an event for each new playlist owned or followed by the current Spotify user.",
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
    let playlists = [];
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
      results.data.items.forEach(function (playlist) {
        playlists.push(playlist);
        count++;
      });
      params.offset += limit;
    }

    for (const playlist of playlists) {
      this.$emit(playlist, {
        id: playlist.id,
        summary: playlist.name,
        ts: Date.now(),
      });
    }
  },
};