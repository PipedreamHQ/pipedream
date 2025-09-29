import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/sources/new-comment-posted/common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api_custom_app-new-comment-posted",
  name: "New Comment Posted",
  description: "Emit new event for each new comment or reply posted to a Youtube video.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    videoId: {
      type: "string",
      label: "Video Id",
      description: "Return comment threads associated with the specified video ID.",
    },
    ...common.props,
  },
};
