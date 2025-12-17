import spotify from "../../spotify.app.mjs";
import common from "../common.mjs";

export default {
  dedupe: "unique",
  type: "source",
  key: "spotify-new-track-in-playlist",
  name: "New Track in Playlist",
  description: "Emit new event for each new Spotify track added to a playlist",
  version: "0.1.4",
  props: {
    ...common.props,
    db: "$.service.db",
    playlistIds: {
      type: "string[]",
      label: "Playlist IDs",
      withLabel: false,
      propDefinition: [
        spotify,
        "playlistId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getMeta({
      track,
      added_at: ts,
      playlistId,
    }) {
      const {
        id,
        name: summary,
      } = track;
      return {
        id: id + playlistId,
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
    for (const playlistId of this.playlistIds) {
      const params = {
        playlistId,
      };

      const playlistItems = await this.spotify._paginate(
        this.spotify.getPlaylistItems.bind(this),
        params,
      );

      for (const item of playlistItems) {
        if (this.isItemRelevant(item, lastEvent)) {
          this.$emit(item, this.getMeta({
            ...item,
            playlistId,
          }));
        }
      }
    }
    this.db.set("lastEvent", new Date());
  },
};
