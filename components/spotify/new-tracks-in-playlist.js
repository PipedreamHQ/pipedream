const spotify = require("https://github.com/PipedreamHQ/pipedream/components/spotify/spotify.app.js");

module.exports = {
  name: "New Tracks in Playlist",
  description: "Emits an event for each new Spotify track added to a playlist.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    spotify,
    playlistId: {
      type: "string",
      label: "Playlist ID",
      description: "Search for new tracks added to the specified playlist.",
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
    let tracks = [];
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

    while (count < total) {
      results = await this.spotify.getPlaylistItems(this.playlistId, params);
      total = results.data.total;
      results.data.items.forEach(function (track) {
        addedAt = new Date(track.added_at);
        if (addedAt.getTime() > lastEvent.getTime()) {
          tracks.push(track);
        }
        count++;
      });
      params.offset += limit;
    }

    this.db.set("lastEvent", now);

    for (const track of tracks) {
      this.$emit(track, {
        id: track.track.id,
        summary: track.track.name,
        ts: track.added_at,
      });
    }
  },
};