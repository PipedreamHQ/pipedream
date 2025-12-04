import common from "../common.mjs";

export default {
  dedupe: "unique",
  type: "source",
  key: "spotify-new-playlist",
  name: "New Playlist",
  description: "Emit new event when a new playlist is created or followed by the current Spotify user.",
  version: "0.1.3",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getMeta({
      id,
      name: summary,
    }) {
      const ts = Date.now();
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const playlists = await this.spotify._paginate(this.spotify.getPlaylists.bind(this));
    for (const playlist of playlists) {
      this.$emit(playlist, this.getMeta(playlist));
    }
  },
};
