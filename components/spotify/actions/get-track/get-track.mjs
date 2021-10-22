import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get a Track",
  description: "Get a track by its name or ID. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#endpoint-search)",
  key: "spotify-get-a-track",
  version: "0.0.5",
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

    // can we pull in the track name instead of ID?
    $.export("$summary", `Successfully fetched info for the track, "${this.trackId}". 🎉`)

    return axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: `/tracks/${trackId}`,
      params: {
        market,
      },
    }));
  },
};
