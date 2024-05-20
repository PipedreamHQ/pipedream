import { axios } from "@pipedream/platform";
import hippoVideo from "../../hippo_video.app.mjs";

export default {
  key: "hippo_video-new-video-render-completion",
  name: "New Video Render Completion",
  description: "Emits an event when a personalized video is generated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    hippoVideo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit events for the most recent videos up to the last 50
      const videos = await this.hippoVideo.getRecentlyRenderedVideos();
      videos.slice(0, 50).forEach((video) => {
        if (video.status === "rendered") {
          this.$emit(video, {
            id: video.id,
            summary: `New video rendered: ${video.title}`,
            ts: Date.parse(video.createdAt),
          });
        }
      });
    },
  },
  methods: {
    ...hippoVideo.methods,
    async getRecentlyRenderedVideos() {
      const response = await this.hippoVideo._makeRequest({
        path: "/videos",
        params: {
          status: "rendered",
        },
      });
      return response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
  },
  async run() {
    const videos = await this.getRecentlyRenderedVideos();
    videos.forEach((video) => {
      if (video.status === "rendered") {
        const latestVideoId = this.db.get("latestVideoId") || 0;
        if (video.id > latestVideoId) {
          this.$emit(video, {
            id: video.id,
            summary: `New video rendered: ${video.title}`,
            ts: Date.parse(video.createdAt),
          });
          this.db.set("latestVideoId", video.id);
        }
      }
    });
  },
};
