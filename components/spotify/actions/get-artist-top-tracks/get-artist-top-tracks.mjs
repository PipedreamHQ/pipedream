import spotify from "../../spotify.app.mjs";

export default {
  name: "Get an Artist's Top Tracks",
  description: "Get Spotify catalog information about an artist’s top tracks by country. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-an-artists-top-tracks)",
  key: "spotify-get-artist-top-tracks",
  version: "0.0.15",
  type: "action",
  props: {
    spotify,
    id: {
      propDefinition: [
        spotify,
        "artistId",
      ],
    },
    market: {
      type: "string",
      label: "Market",
      description: "An [ISO 3166-1 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). Synonym for country. Example: `US` for `United States of America`",
    },
  },
  async run({ $ }) {
    const {
      id,
      market,
    } = this;

    return  this.spotify._makeRequest($, {
      method: "GET",
      path: `/artists/${id}/top-tracks?market=${market}`,
    });
  },
};
