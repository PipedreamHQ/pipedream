import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-add-playlist-items",
  name: "Add Playlist Items",
  description: "Adds resources to a playlist. [See the documentation](https://developers.google.com/youtube/v3/docs/playlistItems/insert) for more information",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
      type: "string[]",
      label: "Video IDs",
      description: "Array of identifiers of the videos to be added to the playlist. E.g. `o_U1CQn68VM` The video ID will be located in the URL of the video page, right after the v= URL parameter",
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
