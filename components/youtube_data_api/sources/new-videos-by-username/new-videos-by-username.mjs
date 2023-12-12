import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-videos-by-username",
  name: "New Videos by Username",
  description: "Emit new event for each new Youtube video tied to a username.",
  version: "0.0.8",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
