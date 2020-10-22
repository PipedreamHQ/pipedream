const spotify = require("../../spotify.app.js");

module.exports = {
  key: "spotify-new-saved-track",
  name: "New Saved Track",
  description:
    "Emit an event for each new track saved to the current Spotify user's Music Library.",
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
      params.offset += limit;
    }

    this.db.set("lastEvent", now);
  },
};