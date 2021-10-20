import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Add Items to a Playlist",
  description: "Add one or more items to a user’s playlist. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#endpoint-add-tracks-to-playlist).",
  key: "spotify-add-item-to-a-playlist",
  version: "0.0.6",
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
      type: "string[]",
      label: "Track or Episode URIs",
      description: "Specify the [track or episode URI](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) to add. For example, `spotify:track:4iV5W9uYEdYUVa79Axb7Rh` or `spotify:episode:512ojhOuo1ktJprKbVcKyQ`. A maximum of 100 items can be added in one request.",
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
      uris,
    };

    return axios($, this.spotify._getAxiosParams({
      method: "POST",
      path: `/playlists/${playlistId}/tracks`,
      data,
    }));
  },
};
