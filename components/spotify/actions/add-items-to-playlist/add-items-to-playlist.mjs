import lodash from "lodash";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Add items to a playlist",
  description: "Add items to a playlist",
  key: "spotify-add-item-to-a-playlist",
  version: "0.0.6",
  type: "action",
  props: {
    spotify,
    playlistId: {
      type: "string",
      label: "Playlist Id",
      description: "The Spotify ID for the playlist.",
    },
    uris: {
      type: "string[]",
      label: "URIs",
      description: "A comma-separated list of Spotify URIs to add, can be track or episode URIs. For example: `uris=spotify:track:4iV5W9uYEdYUVa79Axb7Rh, spotify:track:1301WleyT98MSxVHPZCA6M, spotify:episode:512ojhOuo1ktJprKbVcKyQ`. A maximum of 100 items can be added in one request",
    },
    position: {
      type: "integer",
      label: "Position",
      description: "The position to insert the items, a zero-based index. For example, to insert the items in the first position: `position=0`; to insert the items in the third position: `position=2` . If omitted, the items will be appended to the playlist. Items are added in the order they are listed in the query string or request body.",
      optional: true,
    },
  },
  async run() {
    const {
      playlistId,
      position,
      uris,
    } = this;

    const data = {
      position,
      uris,
    };

    const res = await this.spotify._makeRequest(
      "POST",
      `/playlists/${playlistId}/tracks`,
      null,
      data,
    );

    return {
      data: lodash.get(res, "data"),
      headers: lodash.get(res, "headers"),
    };
  },
};
