import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Save tracks for user",
  description: "Save one or more tracks to the current user’s ‘Your Music’ library. See the docs here: https://developer.spotify.com/documentation/web-api/reference/#endpoint-save-tracks-user",
  key: "spotify-save-track",
  version: "0.0.8",
  type: "action",
  props: {
    spotify,
    ids: {
      type: "string[]",
      label: "IDs",
      description: "A comma-separated list of the Spotify IDs. For example: `4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M`. Maximum: 50 IDs.",
    },
  },
  async run({ $ }) {
    return axios($, this.spotify._getAxiosParams({
      method: "PUT",
      path: "/me/tracks",
      data: {
        ids: this.ids,
      },
    }));
  },
};
