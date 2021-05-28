const common = require("../common.js");

module.exports = {
  ...common,
  key: "spotify-new-playlist",
  name: "New Playlist",
  description:
    "Emit an event when a new playlist is created or followed by the current Spotify user.",
  version: "0.0.2",
  methods: {
    ...common.methods,
    getMeta({ id, name: summary }) {
      const ts = Date.now();
      return { id, summary, ts };
    },
  },
  async run(event) {
    const playlists = await this.paginate(this.spotify.getPlaylists.bind(this));
    for await (const playlist of playlists) {
      this.$emit(playlist, this.getMeta(playlist));
    }
  },
};