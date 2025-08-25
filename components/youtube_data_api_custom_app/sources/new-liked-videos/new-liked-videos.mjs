import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/sources/new-liked-videos/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-new-liked-videos",
  name: "New Liked Videos",
  description: "Emit new event for each new Youtube video liked by the authenticated user",
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
