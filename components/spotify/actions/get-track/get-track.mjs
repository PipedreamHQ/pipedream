import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";
import get from "lodash/get.js";

export default {
  name: "Get a Track",
  description: "Get a track by its name or ID. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/search)",
  key: "spotify-get-a-track",
  version: "0.0.6",
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

    const res = await axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: `/tracks/${get(trackId, "value", trackId)}`,
      params: {
        market,
      },
    }));

    $.export("$summary", `Successfully fetched info for the track, "${res.name}"`);

    return res;
  },
};
