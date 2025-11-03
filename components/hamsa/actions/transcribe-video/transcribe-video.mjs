import {
  LANGUAGE_OPTIONS,
  MODEL_OPTIONS,
} from "../../common/constants.mjs";
import hamsa from "../../hamsa.app.mjs";

export default {
  key: "hamsa-transcribe-video",
  name: "Transcribe Video",
  description: "Automatically transcribe Arabic videos from YouTube URLs or direct links. [See the documentation](https://docs.tryhamsa.com/api-reference/endpoint/transcribe)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hamsa,
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "The URL of the video to be transcribed.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model you want to use to transcribe.",
      options: MODEL_OPTIONS,
    },
    webhookUrl: {
      propDefinition: [
        hamsa,
        "webhookUrl",
      ],
      optional: true,
    },
    webhookAuthKey: {
      type: "string",
      label: "Webhook Auth Key",
      description: "The key to use for authenticating the webhook.",
      optional: true,
    },
    webhookAuthSecret: {
      type: "string",
      label: "Webhook Auth Secret",
      description: "The secret to use for authenticating the webhook.",
      secret: true,
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the transcription.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language of the transcription.",
      options: LANGUAGE_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const webhookAuth = {};
    if (this.webhookAuthKey) {
      webhookAuth.authKey = this.webhookAuthKey;
    }
    if (this.webhookAuthSecret) {
      webhookAuth.authSecret = this.webhookAuthSecret;
    }
    const data = {
      mediaUrl: this.mediaUrl,
      model: this.model,
      processingType: "async",
      webhookUrl: this.webhookUrl,
      title: this.title,
      language: this.language,
    };
    if (Object.keys(webhookAuth).length) {
      data.webhookAuth = webhookAuth;
    }

    const response = await this.hamsa.transcribeVideo({
      $,
      data,
    });

    $.export("$summary", "Transcription job started successfully.");
    return response;
  },
};
