import spiritme from "../../spiritme.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "spiritme-generate-video",
  name: "Generate Video",
  description: "Generates a new video using specific voice and avatar props. [See the documentation](https://api.spiritme.tech/api/swagger/#/videos/videos_create)",
  version: "0.0.1",
  type: "action",
  props: {
    spiritme,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the video",
    },
    avatar: {
      propDefinition: [
        spiritme,
        "avatar",
      ],
    },
    voice: {
      propDefinition: [
        spiritme,
        "voice",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to use for the video. Example: `Hello everyone! I am a virtual avatar from Spiritme.` Use tags `<emotion name=\"emotion_name\"> text </emotion>` to add emotions to the generated video. The list of supported emotions are `neutral`, `semismile`, `smile`, `happiness`, `sadness`, and `surprise`. Either text or audio file is required.",
      optional: true,
    },
    audioFile: {
      propDefinition: [
        spiritme,
        "file",
        () => ({
          type: [
            "audio",
          ],
        }),
      ],
      label: "Audio File",
      description: "Identifier of an audio file. Either text or audio file is required.",
    },
    media: {
      propDefinition: [
        spiritme,
        "file",
        () => ({
          type: [
            "image",
            "video",
          ],
        }),
      ],
      label: "Media File",
      description: "Identifier of an image or video file. One of avatar or media is required.",
    },
    viewType: {
      type: "string",
      label: "View Type",
      description: "Content as is or content in circle. Supported only for avatars.",
      optional: true,
      options: [
        "rectangular",
        "circular",
      ],
    },
    autoEmotionsMarkup: {
      type: "boolean",
      label: "Auto Emotions Markup",
      description: "Add emotions automatically by AI",
      optional: true,
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait For Completion",
      description: "Set to `true` to poll the API in 3-second intervals until the video is completed",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      spiritme,
      name,
      avatar,
      voice,
      text,
      audioFile,
      media,
      viewType,
      autoEmotionsMarkup,
      waitForCompletion,
    } = this;

    if (!avatar && !media) {
      throw new ConfigurationError("One of `Avatar` or `Media File` is required");
    }

    if (!text && !audioFile) {
      throw new ConfigurationError("One of `Text` or `Audio File` is required");
    }

    let response = await spiritme.generateVideo({
      $,
      data: {
        name,
        slides: [
          {
            audio_source: {
              text,
              voice: voice
                ? {
                  id: voice,
                }
                : undefined,
              file: audioFile
                ? {
                  id: audioFile,
                }
                : undefined,
            },
            layers: [
              {
                avatar: avatar
                  ? {
                    id: avatar,
                  }
                  : undefined,
                media: media
                  ? {
                    id: media,
                  }
                  : undefined,
                view_type: viewType,
              },
            ],
          },
        ],
        auto_emotions_markup: autoEmotionsMarkup,
      },
    });

    if (waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      while (response.status !== "success") {
        response = await spiritme.getVideo({
          videoId: response.id,
        });
        await timer(3000);
      }
    }

    $.export("$summary", `Generated video with ID: ${response.id}`);
    return response;
  },
};
