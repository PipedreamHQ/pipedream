import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Remove User's Saved Tracks",
  description: "Remove one or more tracks from the current user’s ‘Your Music’ library. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#endpoint-remove-tracks-user)",
  key: "spotify-remove-user-saved-tracks",
  version: "0.0.1",
  type: "action",
  props: {
    spotify,
    ids: {
      propDefinition: [
        spotify,
        "savedUserTracksId",
      ],
    },
  },
  async run({ $ }) {
    const { ids } = this;

    const resp = await axios($, this.spotify._getAxiosParams({
      method: "DELETE",
      path: "/me/tracks",
      data: {
        ids,
      },
    }));

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully removed ${this.ids.length} ${this.ids.length == 1 ? "item" : "items"} from "Liked Songs". 🎉`);

    return resp;
  },
};
