import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "../../../youtube_data_api/actions/delete-playlist/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-delete-playlist",
  name: "Delete Playlist",
  description: "Deletes a playlist. [See the docs](https://developers.google.com/youtube/v3/docs/playlists/delete) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    youtubeDataApi,
    playlistId: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedPlaylist",
      ],
    },
    onBehalfOfContentOwner: {
      propDefinition: [
        youtubeDataApi,
        "onBehalfOfContentOwner",
      ],
    },
    ...common.props,
  },
};
