import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-new-avatar-video-failure-instant",
  name: "New Avatar Video Failure (Instant)",
  description: "Emits an event when a Heygen video fails during processing",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    heygen,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    async getFailedVideos() {
      const videos = await this.heygen._makeRequest({
        path: "/videos",
        params: {
          status: "failed",
        },
      });
      return videos;
    },
  },
  hooks: {
    async deploy() {
      const failedVideos = await this.getFailedVideos();
      for (const video of failedVideos) {
        this.$emit(video, {
          id: video.id,
          summary: `Video ${video.id} has failed`,
          ts: Date.now(),
        });
      }
    },
  },
  async run() {
    const failedVideos = await this.getFailedVideos();
    for (const video of failedVideos) {
      this.$emit(video, {
        id: video.id,
        summary: `Video ${video.id} has failed`,
        ts: Date.now(),
      });
    }
  },
};
