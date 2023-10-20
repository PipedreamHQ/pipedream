import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-add-playlist-items",
  name: "Add Playlist Items",
  description: "Adds resources to a playlist. [See the docs](https://developers.google.com/youtube/v3/docs/playlistItems/insert) for more information",
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
    videoIds: {
      type: "string[]",
      label: "Video Ids",
      description: "Array of identifiers of the videos to be added to the playlist",
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
