import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-videos-by-location",
  name: "New Videos by Location",
  description: "Emit new event for each new YouTube video tied to a location.",
  version: "0.0.5",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
