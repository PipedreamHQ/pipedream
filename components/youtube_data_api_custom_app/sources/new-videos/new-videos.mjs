import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/sources/new-videos/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-new-videos",
  name: "New Videos",
  description: "Emit new event for each new Youtube video the user posts.",
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
