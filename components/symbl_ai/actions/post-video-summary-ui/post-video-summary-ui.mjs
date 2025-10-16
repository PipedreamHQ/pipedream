import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-post-video-summary-ui",
  name: "Submit Video Summary User Interface",
  description: "The Video Summary UI provides users the ability to interact with the Symbl elements (Transcripts, Questions, Follow-Ups, Action Items, etc.) from a video conversation. See the doc [here](https://docs.symbl.ai/docs/api-reference/experience-api/post-video-summary-ui)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    symblAIApp,
    conversationId: {
      propDefinition: [
        symblAIApp,
        "conversationId",
      ],
    },
    logo: {
      propDefinition: [
        symblAIApp,
        "logo",
      ],
      description: "URL of the custom logo to be used in the Video Summary UI.",
    },
    favicon: {
      propDefinition: [
        symblAIApp,
        "favicon",
      ],
      description: "URL of the custom favicon to be used in the Video Summary UI.",
    },
    background: {
      propDefinition: [
        symblAIApp,
        "background",
      ],
      description: "Background color to be used in the Video Summary UI. Hex Color Codes accepted.",
    },
    topicsFilter: {
      propDefinition: [
        symblAIApp,
        "topicsFilter",
      ],
      description: "Topics Filter Element color to be used in the Video Summary UI. Hex Color Codes accepted.",
    },
    insightsFilter: {
      propDefinition: [
        symblAIApp,
        "insightsFilter",
      ],
      description: "Insights (Questions, Follow-ups, Action Items, etc) Filter Element color to be used in the Video Summary UI. Hex Color Codes accepted.",
    },
    font: {
      propDefinition: [
        symblAIApp,
        "font",
      ],
      description: "The name of the font to be used in the Video Summary UI. All fonts available in the [Google Fonts](https://fonts.google.com/) are supported.",
    },
    summaryURLExpiresIn: {
      propDefinition: [
        symblAIApp,
        "summaryURLExpiresIn",
      ],
      description: "Number of seconds set for expiration time of the Video Summary UI. Zero (0) will set the Video Summary UI to never expire. Default value is set to `2592000` (30 days).",
    },
    readOnly: {
      propDefinition: [
        symblAIApp,
        "readOnly",
      ],
      description: "Disable the editing capabilities of the Video Summary UI. Default value is `false`.",
    },
    enableCustomDomain: {
      propDefinition: [
        symblAIApp,
        "enableCustomDomain",
      ],
      description: "Enable generation of personalized URLs for the Video Summary UI.",
    },
    videoUrl: {
      type: "string",
      label: "Video URL",
      description: "URL of the video file for which you want to generate the Video Summary UI.",
    },
  },
  async run({ $ }) {
    const response =
      await this.symblAIApp.postSummaryUI({
        $,
        conversationId: this.conversationId,
        data: {
          videoUrl: this.videoUrl,
          name: "video-summary",
          logo: this.logo,
          favicon: this.favicon,
          color: {
            background: this.background,
            topicsFilter: this.topicsFilter,
            insightsFilter: this.insightsFilter,
          },
          font: {
            family: this.font,
          },
          summaryURLExpiresIn: this.summaryURLExpiresIn,
          readOnly: this.readOnly,
          enableCustomDomain: this.enableCustomDomain,
        },
      });
    $.export("$summary", `Successfully generated Video Summary UI at: ${response.url}`);
    return response;
  },
};
