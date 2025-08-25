import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/sources/new-videos-in-playlist/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-new-videos-in-playlist",
  name: "New Videos in Playlist",
  description: "Emit new event for each new Youtube video added to a Playlist.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    maxResults: {
      propDefinition: [
        youtubeDataApi,
        "maxResults",
      ],
    },
    ...common.props,
  },
};
