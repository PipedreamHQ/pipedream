import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-videos-in-channel",
  name: "New Videos in Channel",
  description: "Emit new event for each new Youtube video posted to a Channel.",
  version: "0.0.6",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
