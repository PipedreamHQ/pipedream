import app from "../../visibot.app.mjs";
import { parseCaptions } from "../../common/utils.mjs";

export default {
  key: "visibot-create-video",
  name: "Create Video",
  description: "Process a video from a URL with custom caption settings. [See the documentation](https://dashboard.visibot.app/api-docs#video-api-POSTapi-video-create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    videoUrl: {
      type: "string",
      label: "Video URL",
      description: "The URL of the video to process",
    },
    captions: {
      type: "string[]",
      label: "Captions",
      description: `Array of objects with the following properties:
- \`start\` (number) - The start time of the caption in seconds
- \`end\` (number) - The end time of the caption in seconds
- \`text\` (string) - The text of the caption
- \`emoji\` (string) - The emoji of the caption

**Example:**
\`\`\`json
[
  {
    "start": 0,
    "end": 1,
    "text": "Hello, world!",
    "emoji": "✉️"
  }
]
\`\`\``,
      optional: true,
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    resizeForSocialMedia: {
      propDefinition: [
        app,
        "resizeForSocialMedia",
      ],
    },
    captionsFontColor: {
      propDefinition: [
        app,
        "captionsFontColor",
      ],
    },
    captionsHighlightColor: {
      propDefinition: [
        app,
        "captionsHighlightColor",
      ],
    },
    captionsOutlineColor: {
      propDefinition: [
        app,
        "captionsOutlineColor",
      ],
    },
    captionsPosition: {
      propDefinition: [
        app,
        "captionsPosition",
      ],
    },
    captionsFontSize: {
      propDefinition: [
        app,
        "captionsFontSize",
      ],
    },
    captionsFontFamily: {
      propDefinition: [
        app,
        "captionsFontFamily",
      ],
    },
    captionsAddEmojis: {
      propDefinition: [
        app,
        "captionsAddEmojis",
      ],
    },
    captionsOutlineThickness: {
      propDefinition: [
        app,
        "captionsOutlineThickness",
      ],
    },
    callback: {
      propDefinition: [
        app,
        "callback",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      videoUrl,
      language,
      resizeForSocialMedia,
      captionsFontColor,
      captionsHighlightColor,
      captionsOutlineColor,
      captionsPosition,
      captionsFontSize,
      captionsFontFamily,
      captionsAddEmojis,
      captionsOutlineThickness,
      callback,
      captions,
    } = this;

    const response = await app.createVideo({
      $,
      data: {
        video_url: videoUrl,
        language,
        resize_for_social_media: resizeForSocialMedia,
        captions_font_color: captionsFontColor,
        captions_highlight_color: captionsHighlightColor,
        captions_outline_color: captionsOutlineColor,
        captions_position: captionsPosition,
        captions_font_size: captionsFontSize,
        captions_font_family: captionsFontFamily,
        captions_add_emojis: captionsAddEmojis,
        captions_outline_thickness: captionsOutlineThickness,
        callback,
        captions: parseCaptions(captions),
      },
    });
    $.export("$summary", `Successfully started video processing with ID \`${response.video_id}\``);
    return response;
  },
};
