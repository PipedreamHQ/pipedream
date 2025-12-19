import spotify from "../../spotify.app.mjs";

export default {
  name: "Add Items to a Playlist",
  description: "Add one or more items to a user’s playlist. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist).",
  key: "spotify-add-items-to-playlist",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    spotify,
    playlistId: {
      propDefinition: [
        spotify,
        "playlistId",
      ],
    },
    uris: {
      propDefinition: [
        spotify,
        "uris",
      ],
    },
    position: {
      type: "integer",
      label: "Position",
      description: "The position to insert the items, a zero-based index. For example, to insert the items in the first position: `0`; to insert the items in the third position: `2`. If omitted, the items will be appended to the end of the playlist. Items are added in the order they are listed in the query string or request body.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      playlistId,
      position,
      uris,
    } = this;

    const data = {
      position,
      uris: this.spotify.sanitizedArray(uris),
    };

    const { data: resp } = await this.spotify._makeRequest({
      $,
      method: "POST",
      url: `/playlists/${playlistId.value ?? playlistId}/tracks`,
      data,
    });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully added ${data.uris.length} ${data.uris.length == 1 ? "item" : "items"} to "${playlistId.label ?? playlistId}"`);

    return resp;
  },
};
