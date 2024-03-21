import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "vimeo-new-video-of-mine",
  name: "New Video of Mine",
  description: "Emit new event when the user adds a new video.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.vimeo.listVideos;
    },
    getSummary(video) {
      return `New video: ${video.name}`;
    },
  },
  sampleEmit,
};
