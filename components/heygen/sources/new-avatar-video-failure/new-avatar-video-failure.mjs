import common from "../common/base.mjs";

export default {
  ...common,
  key: "heygen-new-avatar-video-failure",
  name: "New Avatar Video Failure (Instant)",
  description: "Emit new event when a Heygen video fails during processing. [See the documentation](https://docs.heygen.com/reference/add-a-webhook-endpoint)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "avatar_video.fail",
      ];
    },
    generateMeta(body) {
      return {
        id: body.event_data.video_id,
        summary: "Video failed to process",
        ts: Date.now(),
      };
    },
  },
};
