const common = require("../common.js");

module.exports = {
  ...common,
  key: "spotify-new-saved-track",
  name: "New Saved Track",
  description:
    "Emit an event for each new track saved to the current Spotify user's Music Library.",
  version: "0.0.2",
  methods: {
    ...common.methods,
    getMeta({ track, added_at: ts }) {
      const { id, name: summary } = track;
      return { id, summary, ts };
    },
    isItemRelevant(item, lastEvent) {
      const addedAt = new Date(item.added_at);
      return (addedAt.getTime() > lastEvent.getTime());
    }
  },
  async run(event) {
    const lastEvent = this.db.get("lastEvent") ? new Date(this.db.get("lastEvent")) : this.daysAgo(30);
    this.db.set("lastEvent", lastEvent);
    const tracks = await this.paginate(this.spotify.getTracks.bind(this));
    for await (const track of tracks) {
      if (this.isItemRelevant(track, lastEvent))
        this.$emit(track, this.getMeta(track));
    }
    this.db.set("lastEvent", new Date());
  },
};