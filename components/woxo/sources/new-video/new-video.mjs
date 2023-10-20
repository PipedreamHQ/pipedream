import woxo from "../../woxo.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Video",
  version: "0.0.2",
  key: "woxo-new-video",
  description: "Emit new event on each new video.",
  type: "source",
  dedupe: "unique",
  props: {
    woxo,
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      label: "Project ID",
      description: "The ID of project. You can get this ID from the url. E.g. With URL `woxo.tech/video/editor?slug=F0AOtl8sdg` the ID will be `F0AOtl8sdg`",
      type: "string",
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New video ${data["Title 1"]}`,
        ts: new Date(),
      });
    },
  },
  hooks: {
    async deploy() {
      const videos = await this.woxo.getVideos({
        projectId: this.projectId,
      });

      videos.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    const videos = await this.woxo.getVideos({
      projectId: this.projectId,
    });

    videos.reverse().forEach(this.emitEvent);
  },
};
