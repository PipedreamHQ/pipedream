import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-post-video-url",
  name: "Submit Video URL",
  description: "Submit a Video by providing the URL for processing. See the doc [here](https://docs.symbl.ai/docs/async-api/overview/video/post-video-url)",
  version: "0.0.2",
  type: "action",
  props: {
    symblAIApp,
    videoUrl: {
      type: "string",
      label: "Video URL",
      description: "The URL of the video to be processed",
      optional: false,
    },
    meetingName: {
      type: "string",
      label: "Meeting Name",
      description: "The meeting name. The default name is set to the conversationId",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response =
        await this.symblAIApp.postVideoUrl({
          $,
          data: {
            url: this.videoUrl,
            name: this.meetingName ?? "",
          },
        });
      $.export("$summary", `Successfully posted video URL for processing with Conversation Id: ${response.conversationId} and Job Id: ${response.jobId}`);
      return response;
    } catch (error) {
      console.log("Error: ", error);
      $.export("summary", "Failed to post video URL");
    }
  },
};
