import spotify from "../../spotify.app.mjs";

export default {
  dedupe: "unique",
  type: "source",
  key: "spotify-source-new-saved-track",
  name: "New Saved Track",
  description:
    "Emit new event for each new track saved to the current Spotify user's Music Library.",
  version: "0.0.3",
  props: {
    spotify,
    db: "$.service.db",
  },
  methods: {
    daysAgo(days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return daysAgo;
    },
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
    const tracks = await this.spotify._paginate(this.spotify.getTracks.bind(this));

    tracks.forEach((track) => {
      if (this.isItemRelevant(track, lastEvent)) {
        this.$emit(track, this.getMeta(track));
      }
    });

    this.db.set("lastEvent", new Date());
  },
};
