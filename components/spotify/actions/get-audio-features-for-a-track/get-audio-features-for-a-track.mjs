import lodash from "lodash";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get Audio Features for a Track",
  description: "Get audio feature information for a single track identified by its unique Spotify ID. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-audio-features)",
  key: "spotify-get-audio-features-for-a-track",
  version: "0.0.3",
  type: "action",
  props: {
    spotify,
    id: {
      type: "string",
      label: "ID",
      description: "The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the track. For example: `4iV5W9uYEdYUVa79Axb7Rh`.",
    },
  },
  async run() {
    const res = await this.spotify._makeRequest(
      "GET",
      `/audio-features/${this.id}`,
      null,
    );

    return {
      data: lodash.get(res, "data"),
      headers: lodash.get(res, "headers"),
    };
  },
};
