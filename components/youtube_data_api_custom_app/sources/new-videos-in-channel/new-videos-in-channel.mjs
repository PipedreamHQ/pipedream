import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "../../../youtube_data_api/sources/new-videos-in-channel/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-new-videos-in-channel",
  name: "New Videos in Channel",
  description: "Emit new event for each new Youtube video posted to a Channel.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
