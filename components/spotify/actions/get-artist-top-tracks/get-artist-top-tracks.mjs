import { axios } from "@pipedream/platform";
import lodash from "lodash";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get an Artist's Top Tracks",
  description: "Get Spotify catalog information about an artist’s top tracks by country. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-an-artists-top-tracks)",
  key: "spotify-get-artist-top-tracks",
  version: "0.0.1",
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
      propDefinition: [
        spotify,
        "market",
      ],
    },
  },
  async run({ $ }) {
    const {
      id,
      market,
    } = this;

    const res = await axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: `/artists/${id}/top-tracks`,
      params: {
        market,
      },
    }));
    return lodash.get(res, "tracks", []);
  },
};
