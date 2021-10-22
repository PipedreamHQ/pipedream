import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get Audio Features for a Track",
  description: "Get audio feature information for a single track identified by its unique Spotify ID. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-audio-features).",
  key: "spotify-get-audio-features-for-a-track",
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
  },
  async run({ $ }) {
    const resp = await axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: `/audio-features/${this.trackId.value}`,
    }));

    $.export("$summary", `Successfully fetched audio features for track "${this.trackId.label}". 🎉`);

    return resp;
  },
};
