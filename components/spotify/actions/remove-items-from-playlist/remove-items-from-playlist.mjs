import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Remove Items from a Playlist",
  description: "Remove one or more items from a user’s playlist. See the docs here: https://developer.spotify.com/documentation/web-api/reference/#endpoint-remove-tracks-playlist",
  key: "spotify-remove-items-from-playlist",
  version: "0.0.12",
  type: "action",
  props: {
    spotify,
    playlistId: {
      propDefinition: [
        spotify,
        "playlistId",
      ],
    },
    tracks: {
      propDefinition: [
        spotify,
        "tracks",
      ],
    },
    snapshotId: {
      type: "string",
      label: "Snapshot ID",
      description: "The playlist’s snapshot ID against which you want to make the changes. The API will validate that the specified items exist and in the specified positions and make the changes, even if more recent changes have been made to the playlist.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      playlistId,
      tracks,
      snapshotId,
    } = this;

    const data = {
      tracks: tracks.map((track) => ({
        uri: track,
      })),
      snapshot_id: snapshotId,
    };

    return axios($, this.spotify.__getAxiosParams({
      method: "DELETE",
      path: `/playlists/${playlistId}/tracks`,
      data,
    }));
  },
};
