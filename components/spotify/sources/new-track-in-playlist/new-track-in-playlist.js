const spotify = require("../../spotify.app.js");
const common = require("../common.js");

module.exports = {
  ...common,
  type: "source",
  key: "spotify-new-track-in-playlist",
  name: "New Track in Playlist",
  description: "Emit new event for each new Spotify track added to a playlist",
  version: "0.0.2",
  props: {
    ...common.props,
    playlists: {
      propDefinition: [
        spotify,
        "playlists",
      ],
    },
  },
  methods: {
    ...common.methods,
    getMeta({
      track,
      added_at: ts,
    }) {
      const {
        id,
        name: summary,
      } = track;
      return {
        id,
        summary,
        ts,
      };
    },
    isItemRelevant(item, lastEvent) {
      const addedAt = new Date(item.added_at);
      return (addedAt.getTime() > lastEvent.getTime());
    },
  },
  async run() {
    const lastEvent = this.db.get("lastEvent")
      ? new Date(this.db.get("lastEvent"))
      : this.daysAgo(30);
    this.db.set("lastEvent", lastEvent);
    for (const playlistId of this.playlists) {
      const params = {
        playlistId,
      };
      const playlistItems = await this.paginate(this.spotify.getPlaylistItems.bind(this), params);
      for await (const item of playlistItems) {
        if (this.isItemRelevant(item, lastEvent))
          this.$emit(item, this.getMeta(item));
      }
    }
    this.db.set("lastEvent", new Date());
  },
};
