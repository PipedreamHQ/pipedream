import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get an Artist's Top Tracks",
  description: "Get Spotify catalog information about an artist’s top tracks by country. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-top-tracks).",
  key: "spotify-get-artist-top-tracks",
  version: "0.0.3",
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

    const res = await axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: `/artists/${get(artistId, "value", artistId)}/top-tracks`,
      params: {
        market,
      },
    }));

    $.export("$summary", `Successfully fetched top tracks for "${get(artistId, "label", artistId)}"`);

    return get(res, "tracks", []);
  },
};
