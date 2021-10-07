import lodash from "lodash";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get an Artist's Top Tracks",
  description: "Get Spotify catalog information about an artist’s top tracks by country.",
  key: "spotify-get-artist-top-tracks",
  version: "0.0.3",
  type: "action",
  props: {
    spotify,
    id: {
      type: "string",
      label: "ID",
      description: "The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the artist. For example: `43ZHCT0cAZBISjO8DG9PnE`.",
    },
    market: {
      type: "string",
      label: "Market",
      description: "An [ISO 3166-1 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). Synonym for country. Example: `US` for `United States of America`",
    },
  },
  async run() {
    const {
      id,
      market,
    } = this;
    const res = await this.spotify._makeRequest(
      "GET",
      `/artists/${id}/top-tracks?market=${market}`,
    );

    return {
      data: lodash.get(res, "data"),
      headers: lodash.get(res, "headers"),
    };
  },
};
