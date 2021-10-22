import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Remove Items from a Playlist",
  description: "Remove one or more items from a user’s playlist. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#endpoint-remove-tracks-playlist)",
  key: "spotify-remove-items-from-playlist",
  version: "0.0.1",
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
      tracks,
      snapshotId,
    } = this;

    const data = {
      tracks: this.spotify.sanitizedArray(tracks).map((track) => ({
        uri: track,
      })),
      snapshot_id: snapshotId,
    };

    const resp = await axios($, this.spotify._getAxiosParams({
      method: "DELETE",
      path: `/playlists/${playlistId}/tracks`,
      data,
    }));

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully removed ${this.tracks.length} ${this.tracks.length == 1 ? "item" : "items"} from the playlist, "${this.playlistId}". 🎉`);

    return resp;
  },
};
