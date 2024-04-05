import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "vimeo-new-video-by-search",
  name: "New Video by Search",
  description: "Emit new event each time a new video matching the search terms is added.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "The term to search for new videos",
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.vimeo.searchVideos;
    },
    getParams() {
      return {
        query: this.searchTerm,
        sort: "date",
        direction: "desc",
      };
    },
    getSummary(video) {
      return `New video matching search: ${video.name}`;
    },
  },
  async run() {
    await this.processEvent(100);
  },
  sampleEmit,
};
