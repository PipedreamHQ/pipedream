import { axios } from "@pipedream/platform";
import hippoVideo from "../../hippo_video.app.mjs";

export default {
  key: "hippo_video-new-lead",
  name: "New Lead from Video",
  description: "Emits an event when a video generates a new lead. [See the documentation](https://help.hippovideo.io/support/solutions/articles/19000095984-video-reports-api)",
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
    videoId: {
      propDefinition: [
        hippoVideo,
        "videoId",
      ],
    },
  },
  methods: {
    ...hippoVideo.methods,
    async fetchLeads(videoId) {
      const analyticsData = await this.hippoVideo.getVideoAnalytics({
        videoId,
      });
      // Assuming analyticsData contains leads information
      return analyticsData.leads || [];
    },
  },
  async run() {
    const videoId = this.videoId;
    const leads = await this.fetchLeads(videoId);

    if (!leads || leads.length === 0) {
      console.log("No new leads found.");
      return;
    }

    leads.forEach((lead) => {
      const emitId = lead.email
        ? `${videoId}-${lead.email}-${lead.last_viewed_time}`
        : `${videoId}-${Date.now()}`;
      const summary = lead.name
        ? `New lead ${lead.name} from video ${videoId}`
        : `New lead from video ${videoId}`;

      this.$emit(lead, {
        id: emitId,
        summary,
        ts: lead.last_viewed_time
          ? Date.parse(lead.last_viewed_time)
          : new Date().getTime(),
      });
    });
  },
};
