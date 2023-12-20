import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-new-avatar-video-success-instant",
  name: "New Avatar Video Success Instant",
  description: "Emits an event when a new avatar video has been successfully generated.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    heygen,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  async run() {
    const video = await this.heygen.generateVideo();
    if (video) {
      this.$emit(video, {
        id: video.id,
        summary: `New avatar video with ID ${video.id} has been generated.`,
        ts: Date.now(),
      });
    }
  },
};
