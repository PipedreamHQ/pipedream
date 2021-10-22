import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";
import isEmpty from "lodash/isEmpty.js";

export default {
  name: "Save Tracks for User",
  description: "Save one or more tracks to the current user’s \"Your Music\" library. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#endpoint-save-tracks-user).",
  key: "spotify-save-track",
  version: "0.0.27",
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
    const res = await axios($, this.spotify._getAxiosParams({
      method: "PUT",
      path: "/me/tracks",
      data: {
        ids: this.spotify.sanitizedArray(this.ids),
      },
    }));

    $.export("$summary", `Successfully added track to "Liked Songs" 🎉`)

    return isEmpty(res)
      ? this.ids
      : res;
  },
};
