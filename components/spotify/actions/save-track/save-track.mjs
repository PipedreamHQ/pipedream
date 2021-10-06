import lodash from "lodash";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Save tracks for user",
  description: "Save one or more tracks to the current user’s ‘Your Music’ library.",
  key: "spotify-save-track",
  version: "0.0.6",
  type: "action",
  props: {
    spotify,
    ids: {
      type: "string[]",
      label: "Ids",
      description: "A comma-separated list of the Spotify IDs. For example: `ids=4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M`. Maximum: 50 IDs.",
    },
  },
  async run() {
    const { ids } = this;

    const data = {
      ids,
    };

    const res = await this.spotify._makeRequest(
      "PUT",
      "/me/tracks",
      null,
      data,
    );

    return {
      data: lodash.get(res, "data"),
      headers: lodash.get(res, "headers"),
    };
  },
};
