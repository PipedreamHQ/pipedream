import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-subscriber",
  name: "New Subscriber",
  description: "Emit new event for each new Youtube subscriber to user Channel.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
