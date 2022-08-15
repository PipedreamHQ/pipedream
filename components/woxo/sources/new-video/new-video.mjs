import woxo from "../../woxo.app.mjs";

export default {
  name: "New Video",
  version: "0.0.1",
  key: "woxo-new-video",
  description: "Emit new event on each new video.",
  type: "source",
  dedupe: "unique",
  props: {
    woxo,
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    projectId: {
      label: "Project ID",
      description: "The ID of project",
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
