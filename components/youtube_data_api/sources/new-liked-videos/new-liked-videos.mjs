import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-liked-videos",
  name: "New Liked Videos",
  description: "Emit new event for each new Youtube video liked by the authenticated user.",
  version: "0.0.3",
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
