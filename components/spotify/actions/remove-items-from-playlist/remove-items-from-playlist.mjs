import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";
import get from "lodash/get.js";

export default {
  name: "Remove Items from a Playlist",
  description: "Remove one or more items from a user’s playlist. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/remove-tracks-playlist)",
  key: "spotify-remove-items-from-playlist",
  version: "0.0.3",
  type: "action",
  props: {
    spotify,
    playlistId: {
      propDefinition: [
        spotify,
        "playlistId",
      ],
    },
    playlistTracksUris: {
      propDefinition: [
        spotify,
        "playlistTracksUris",
        (c) => ({
          playlistId: c.playlistId,
        }),
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
      playlistTracksUris,
      snapshotId,
    } = this;

    const tracks = this.spotify.sanitizedArray(playlistTracksUris).map((track) => ({
      uri: track,
    }));

    const data = {
      tracks,
      snapshot_id: snapshotId,
    };

    const resp = await axios($, this.spotify._getAxiosParams({
      method: "DELETE",
      path: `/playlists/${get(playlistId, "value", playlistId)}/tracks`,
      data,
    }));

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully removed ${tracks.length} ${tracks.length == 1 ? "item" : "items"} from the playlist, "${get(playlistId, "label", playlistId)}"`);

    return resp;
  },
};
