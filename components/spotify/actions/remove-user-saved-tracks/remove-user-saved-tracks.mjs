import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Remove User's Saved Tracks",
  description: "Remove one or more tracks from the current user’s ‘Your Music’ library. See the docs here: https://developer.spotify.com/documentation/web-api/reference/#endpoint-remove-tracks-user",
  key: "spotify-remove-user-saved-tracks",
  version: "0.0.1",
  type: "action",
  props: {
    spotify,
    ids: {
      type: "string[]",
      description: "The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the track. For example: `4iV5W9uYEdYUVa79Axb7Rh`. You can also type the track name, we can find it for you. Maximum: 50 IDs.",
      propDefinition: [
        spotify,
        "trackId",
      ],
    },
  },
  async run({ $ }) {
    const { ids } = this;
    return axios($, this.spotify._getAxiosParams({
      method: "DELETE",
      path: "/me/tracks",
      data: {
        ids,
      },
    }));
  },
};
