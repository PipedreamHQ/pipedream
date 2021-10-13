import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get a Track",
  description: "Get a track by its name or ID. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#endpoint-search)",
  key: "spotify-get-a-track",
  version: "0.0.1",
  type: "action",
  props: {
    spotify,
    trackId: {
      propDefinition: [
        spotify,
        "trackId",
      ],
    },
    market: {
      propDefinition: [
        spotify,
        "market",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      trackId,
      market,
    } = this;

    const query = this.spotify._getQuery({
      market,
    });

    return axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: `/tracks/${trackId}${query}`,
    }));
  },
};
