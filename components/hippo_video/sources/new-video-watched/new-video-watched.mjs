import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import hippoVideo from "../../hippo_video.app.mjs";

export default {
  key: "hippo_video-new-video-watched",
  name: "New Video Watched",
  description: "Emits an event each time a visitor watches a video.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    hippoVideo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    videoId: {
      propDefinition: [
        hippoVideo,
        "videoId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emit events for the first time during deployment
      await this.fetchAndEmitEvents();
    },
    async activate() {
      // Placeholder for hook logic on activation
    },
    async deactivate() {
      // Placeholder for hook logic on deactivation
    },
  },
  methods: {
    async fetchAndEmitEvents() {
      const videoId = this.videoId;
      const analytics = await this.hippoVideo.getVideoAnalytics({
        videoId,
      });

      analytics.viewer_profile.forEach((profile) => {
        const event = {
          id: `${profile.video_id}-${profile.email}-${profile.last_viewed_time}`,
          summary: `Video ${profile.video_id} watched by ${profile.email}`,
          ts: new Date(profile.last_viewed_time).getTime(),
        };
        this.$emit(profile, event);
      });
    },
  },
  async run() {
    await this.fetchAndEmitEvents();
  },
};
