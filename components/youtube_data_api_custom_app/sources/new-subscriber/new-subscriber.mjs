import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/sources/new-subscriber/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-new-subscriber",
  name: "New Subscriber",
  description: "Emit new event for each new Youtube subscriber to user Channel.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
