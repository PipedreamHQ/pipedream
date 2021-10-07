import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get Audio Features for a Track",
  description: "Get audio feature information for a single track identified by its unique Spotify ID. See the docs here: https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-audio-features",
  key: "spotify-get-audio-features-for-a-track",
  version: "0.0.26",
  type: "action",
  props: {
    spotify,
    id: {
      propDefinition: [
        spotify,
        "trackId",
      ],
    },
  },
  async run({ $ }) {
    return axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: `/audio-features/${this.id}`,
    }));
  },
};
