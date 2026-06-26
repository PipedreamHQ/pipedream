import spotify from "../../spotify.app.mjs";
import common from "../common.mjs";

// New albums and albums whose track count changed are fetched immediately. To
// also catch same-count edits (a track swapped/replaced, which leaves
// `total_tracks` unchanged), every album is re-scanned once per this
// interval (default: once per day).
const MIN_TRACK_RECHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

export default {
  dedupe: "unique",
  type: "source",
  key: "spotify-new-track-by-artist",
  name: "New Track by Artist",
  description: "Emit new event for each new Spotify track related with an artist. [see docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-multiple-albums)",
  version: "0.1.6",
  props: {
    ...common.props,
    db: "$.service.db",
    artistId: {
      propDefinition: [
        spotify,
        "artistId",
      ],
    },
    market: {
      propDefinition: [
        spotify,
        "market",
      ],
    },
  },
  methods: {
    ...common.methods,
    getMeta({ track }) {
      const {
        id,
        name: summary,
      } = track;
      return {
        id: id,
        summary,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const {
      artistId,
      market,
    } = this;

    const now = Date.now();
    const lastCheckedAt = this.db.get("lastCheckedAt") ?? 0;
    const trackCounts = this.db.get("albumTrackCounts") ?? {};

    // The album listing is cheap, so fetch it every run to detect new albums and
    // track-count changes immediately.
    const albums = await this.spotify.getArtistAlbums({
      artistId,
      market,
    });

    // Re-scan every album once the interval has elapsed; between sweeps, only
    // fetch tracks for albums that are new or whose track count changed.
    const dueForFullSweep = (now - lastCheckedAt) >= MIN_TRACK_RECHECK_INTERVAL_MS;
    const staleAlbumIds = albums
      .filter((album) => dueForFullSweep || trackCounts[album.id] !== album.total_tracks)
      .map((album) => album.id);

    if (staleAlbumIds.length) {
      const tracks = await this.spotify.getAllTracksByAlbumIds({
        albumIds: staleAlbumIds,
        market,
      });

      for (const track of tracks) {
        this.$emit(
          track,
          this.getMeta({
            track,
          }),
        );
      }
    }

    // Rebuild from the current listing so the store stays bounded and drops
    // albums that are no longer in the artist's catalog.
    const updatedTrackCounts = Object.fromEntries(
      albums.map((album) => [
        album.id,
        album.total_tracks,
      ]),
    );
    this.db.set("albumTrackCounts", updatedTrackCounts);

    // Only advance the sweep timer when a full sweep actually ran.
    if (dueForFullSweep) {
      this.db.set("lastCheckedAt", now);
    }
  },
};
