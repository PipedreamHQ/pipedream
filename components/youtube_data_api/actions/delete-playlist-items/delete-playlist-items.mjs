import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-delete-playlist-items",
  name: "Delete Playlist Items",
  description: "Deletes a playlist item. [See the documentation](https://developers.google.com/youtube/v3/docs/playlistItems/delete) for more information",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    youtubeDataApi,
    playlistId: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedPlaylist",
      ],
    },
    videoIds: {
      propDefinition: [
        youtubeDataApi,
        "playlistItemIds",
        (c) => ({
          playlistId: c.playlistId,
        }),
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
