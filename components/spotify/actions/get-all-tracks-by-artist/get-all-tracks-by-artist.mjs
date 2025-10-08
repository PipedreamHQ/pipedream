import get from "lodash/get.js";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get All Tracks by Artist",
  description: "Get Spotify tracks information related with an artist's. [see docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-multiple-albums).",
  key: "spotify-get-all-tracks-by-artist",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    spotify,
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
  async run({ $ }) {
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

    $.export("$summary", `Successfully fetched ${tracks.length} tracks for "${get(artistId, "label", artistId)}"`);

    return tracks;
  },
};
