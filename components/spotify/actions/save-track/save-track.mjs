import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Save Tracks for User",
  description: "Save one or more tracks to the current user’s \"Your Music\" library. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#endpoint-save-tracks-user).",
  key: "spotify-save-track",
  version: "0.0.1",
  type: "action",
  props: {
    spotify,
    ids: {
      propDefinition: [
        spotify,
        "trackId",
      ],
      type: "string[]",
      label: "Track IDs",
    },
  },
  async run({ $ }) {
    return axios($, this.spotify._getAxiosParams({
      method: "PUT",
      path: "/me/tracks",
      data: {
        ids: this.spotify.sanitizedArray(this.ids),
      },
    }));
  },
};
