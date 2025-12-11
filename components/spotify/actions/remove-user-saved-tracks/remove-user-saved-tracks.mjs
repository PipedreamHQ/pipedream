import spotify from "../../spotify.app.mjs";

export default {
  name: "Remove User's Saved Tracks",
  description: "Remove one or more tracks from the current user's 'Your Music' library. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/remove-tracks-user)",
  key: "spotify-remove-user-saved-tracks",
  version: "0.1.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    spotify,
    savedUserTracksId: {
      propDefinition: [
        spotify,
        "savedUserTracksId",
      ],
    },
  },
  async run({ $ }) {
    const { savedUserTracksId } = this;

    const ids = this.spotify.sanitizedArray(savedUserTracksId);

    const { data } = await this.spotify._makeRequest({
      $,
      method: "DELETE",
      url: "/me/tracks",
      data: {
        ids,
      },
    });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully removed ${ids.length} ${ids.length == 1 ? "item" : "items"} from "Liked Songs"`);

    return data;
  },
};
