import heygen from "../../heygen.app.mjs";

export default {
  props: {
    heygen,
  },
  async run({ $ }) {
    const DELAY = 1000 * 10;
    const { run } = $.context;
    if (run.runs === 1) {
      const videoId = await this.processVideo($);
      $.flow.rerun(DELAY, {
        videoId,
      });
    }
    else {
      const videoId = run.context.videoId;
      const { data: video } = await this.heygen.getVideo({
        params: {
          video_id: videoId,
        },
        $,
      });
      if (video.status === "processing") {
        $.flow.rerun(DELAY, {
          videoId,
        });
      }
      if (video.status === "failed") {
        throw new Error(video.error.message);
      }
      if (video.status === "completed") {
        $.export("$summary", `Successfully created talking photo with ID ${videoId}`);
        return video;
      }
    }
  },
};
