import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-videos-by-search",
  name: "New Videos by Search",
  description: "Emit new event for each new YouTube video matching a search query.",
  version: "0.0.7",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    maxResults: {
      propDefinition: [
        youtubeDataApi,
        "maxResults",
      ],
    },
    ...common.props,
  },
};
