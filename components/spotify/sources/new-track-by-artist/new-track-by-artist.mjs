import spotify from "../../spotify.app.mjs";
import common from "../common.mjs";

export default {
  dedupe: "unique",
  type: "source",
  key: "spotify-new-track-by-artist",
  name: "New Track by Artist",
  description: "Emit new event for each new Spotify track related with an artist. [see docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-multiple-albums)",
  version: "0.1.4",
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

    const chunksOfAlbumIds = await this.spotify.fetchChunksOfAlbumsIds({
      artistId,
      market,
    });

    const tracks = await this.spotify.getAllTracksByChunksOfAlbumIds({
      chunksOfAlbumIds,
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
  },
};
