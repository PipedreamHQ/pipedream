import spotify from "../../spotify.app.mjs";

export default {
  name: "Get an Artist's Top Tracks",
  description: "Get Spotify catalog information about an artist's top tracks by country. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-top-tracks).",
  key: "spotify-get-artist-top-tracks",
  version: "0.1.4",
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

    const res = await this.spotify._makeRequest({
      $,
      url: `/artists/${artistId.value ?? artistId}/top-tracks`,
      params: {
        market,
      },
    });

    $.export("$summary", `Successfully fetched top tracks for "${artistId.label ?? artistId}"`);

    return res.tracks ?? [];
  },
};
