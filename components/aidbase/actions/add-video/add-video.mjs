import aidbase from "../../aidbase.app.mjs";

export default {
  key: "aidbase-add-video",
  name: "Add Video",
  description: "Add a video as a piece of knowledge to your Aidbase account. [See the documentation](https://docs.aidbase.ai/apis/knowledge-api/reference/#post-knowledgevideo)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aidbase,
    videoUrl: {
      type: "string",
      label: "Video URL",
      description: "The URL of the video to add. Must be a valid YouTube URL.",
    },
  },
  async run({ $ }) {
    const response = await this.aidbase.createVideo({
      $,
      data: {
        video_url: this.videoUrl,
        video_type: "YOUTUBE",
      },
    });
    $.export("$summary", `Successfully created video with ID ${response.data.id}`);
    return response;
  },
};
