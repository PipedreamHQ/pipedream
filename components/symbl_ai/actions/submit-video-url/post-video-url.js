import axios from "axios";

export default {
  key: "symbl_ai-post-video-url",
  name: "Submit Video URL",
  description: "Submit a Video by providing the URL for processing",
  version: "0.0.1",
  type: "action",
  props: {
    symbl_ai: {
      type: "app",
      app: "symbl_ai",
      label: "",
      description: "",
    },
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
    const data = {
      name: `${this.$meetingName}` || "",
      url: `${this.videoUrl}`,
    };
    try {
      const response = await axios({
        method: "POST",
        url: "https://api.symbl.ai/v1/process/video/url",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.symbl_ai.$auth.oauth_access_token}`,
        },
        data: data,
      });
      $.export("$summary", `Conversation Id: ${response.data.conversationId} and Job Id: ${response.data.jobId}`);
      $.export("conversationId", `${response.data.conversationId}` );
      $.export("jobId", `${response.data.jobId}` );
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
    }
  },
};
