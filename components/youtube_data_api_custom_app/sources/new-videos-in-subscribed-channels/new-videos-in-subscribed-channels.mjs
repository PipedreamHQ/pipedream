import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/sources/new-videos-in-subscribed-channels/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-new-videos-in-subscribed-channels",
  name: "New Videos in Subscribed Channels",
  description: "Emit new event for each new YouTube video posted to a subscribed channel.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
