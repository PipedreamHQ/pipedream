import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "../../../youtube_data_api/actions/reply-to-comment/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-reply-to-comment",
  name: "Reply To Comment",
  description: "Creates a reply to an existing comment. [See the docs](https://developers.google.com/youtube/v3/docs/comments/insert) for more information",
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
    commentThread: {
      propDefinition: [
        youtubeDataApi,
        "commentThread",
        (c) => ({
          channelId: c.channelId,
        }),
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the comment",
    },
    ...common.props,
  },
};
