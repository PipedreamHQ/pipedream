import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-create-comment-thread",
  name: "Create Comment Thread",
  description: "Creates a new top-level comment in a video. [See the docs](https://developers.google.com/youtube/v3/docs/commentThreads/insert) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    youtubeDataApi,
    channelId: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedChannel",
      ],
    },
    videoId: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedVideo",
      ],
      description: "Select the video to add comment to. Leave blank to post comment to channel.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the comment",
    },
    ...common.props,
  },
};
