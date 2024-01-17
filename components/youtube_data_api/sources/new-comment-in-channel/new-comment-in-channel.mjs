import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-comment-in-channel",
  name: "New Comment In Channel",
  description: "Emit new event for each new comment or reply posted to a Youtube channel (or any of its videos).",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    channelId: {
      propDefinition: [
        youtubeDataApi,
        "channelId",
      ],
    },
    ...common.props,
  },
};
