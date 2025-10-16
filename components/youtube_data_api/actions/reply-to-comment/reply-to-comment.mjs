import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-reply-to-comment",
  name: "Reply To Comment",
  description: "Creates a reply to an existing comment. [See the documentation](https://developers.google.com/youtube/v3/docs/comments/insert) for more information",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
