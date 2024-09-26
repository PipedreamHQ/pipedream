import common from "../common/base.mjs";

export default {
  ...common,
  key: "heygen-new-avatar-video-success",
  name: "New Avatar Video Success (Instant)",
  description: "Emit new event when a new avatar video has been successfully generated. [See the documentation](https://docs.heygen.com/reference/add-a-webhook-endpoint)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "avatar_video.success",
      ];
    },
    generateMeta(body) {
      return {
        id: body.event_data.video_id,
        summary: "New video generated successfully",
        ts: Date.now(),
      };
    },
  },
};
