import vimeo from "../../vimeo.app.mjs";

export default {
  key: "vimeo-new-video-liked",
  name: "New Video Liked",
  description: "Emits an event each time a user likes a new video on Vimeo.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    vimeo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created_time, name,
      } = data;
      return {
        id,
        summary: `New Video Liked: ${name}`,
        ts: new Date(created_time).getTime(),
      };
    },
  },
  async run() {
    let lastEvent = this.db.get("lastEvent") || {
      created_time: new Date().toISOString(),
    };
    const { data: likedVideos } = await this.vimeo._makeRequest({
      path: "/me/likes",
    });

    for (const video of likedVideos) {
      if (new Date(video.created_time) > new Date(lastEvent.created_time)) {
        const meta = this.generateMeta(video);
        this.$emit(video, meta);
        lastEvent = video;
      }
    }

    this.db.set("lastEvent", lastEvent);
  },
};
