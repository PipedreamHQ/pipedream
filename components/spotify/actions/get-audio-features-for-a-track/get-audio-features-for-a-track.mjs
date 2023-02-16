import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";
import get from "lodash/get.js";

export default {
  name: "Get Audio Features for a Track",
  description: "Get audio feature information for a single track identified by its unique Spotify ID. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-audio-features).",
  key: "spotify-get-audio-features-for-a-track",
  version: "0.0.4",
  type: "action",
  props: {
    spotify,
    trackId: {
      propDefinition: [
        spotify,
        "trackId",
      ],
    },
  },
  async run({ $ }) {
    const { trackId } = this;
    const resp = await axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: `/audio-features/${get(trackId, "value", trackId)}`,
    }));

    $.export("$summary", `Successfully fetched audio info for the track, "${get(trackId, "label", trackId)}"`);

    return resp;
  },
};
