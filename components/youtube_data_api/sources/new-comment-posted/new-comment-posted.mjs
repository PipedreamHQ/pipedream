import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-comment-posted",
  name: "New Comment Posted",
  description: "Emit new event for each new comment or reply posted to a Youtube video.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    channelId: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedChannel",
      ],
      description: "Select a Channel or provide a custom Channel ID. E.g. `UChkRx83xLq2nk55D8CRODVz`",
      optional: true,
    },
    videoId: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedVideo",
        (c) => ({
          channelId: c.channelId,
        }),
      ],
      description: "Return comment threads associated with the specified video ID. E.g. `H1h07Rq7nrz`",
      optional: true,
    },
    ...common.props,
  },
};
