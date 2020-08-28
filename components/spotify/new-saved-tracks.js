const spotify = require("https://github.com/PipedreamHQ/pipedream/components/spotify/spotify.app.js");

module.exports = {
  name: "New Saved Tracks",
  description:
    "Emits an event for each new track saved to the current Spotify user's Music Library.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    spotify,
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
    let limit = 20;
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
      results = await this.spotify.getTracks(params);
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