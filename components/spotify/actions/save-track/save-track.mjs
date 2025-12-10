import spotify from "../../spotify.app.mjs";

export default {
  name: "Save Tracks for User",
  description: "Save one or more tracks to the current user's \"Your Music\" library. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/save-tracks-user).",
  key: "spotify-save-track",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    spotify,
    trackIds: {
      propDefinition: [
        spotify,
        "trackId",
      ],
      type: "string[]",
      label: "Track IDs",
      description: "Type to search for any tracks on Spotify or enter a custom expression to reference specific [Track IDs](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) (for example, `4iV5W9uYEdYUVa79Axb7Rh` or `4iV5W9uYEdYUVa79Axb7Rh, 0gplL1WMoJ6iYaPgMCL0gX`).",
    },
  },
  async run({ $ }) {
    const ids = this.spotify.sanitizedArray(this.trackIds);
    const res = await this.spotify._makeRequest({
      $,
      method: "PUT",
      url: "/me/tracks",
      data: {
        ids,
      },
    });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully saved ${ids.length} ${ids.length == 1 ? "track" : "tracks"} to "Liked Songs"`);

    return !res || Object.keys(res).length === 0
      ? ids
      : res;
  },
};
