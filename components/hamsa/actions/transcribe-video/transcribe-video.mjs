import hamsa from "../../hamsa.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "hamsa-transcribe-video",
  name: "Transcribe Video",
  description: "Automatically transcribe Arabic videos from YouTube URLs or direct links. [See the documentation](https://docs.tryhamsa.com/api-reference/endpoint/transcribe)",
  version: "0.0.1",
  type: "action",
  props: {
    hamsa,
    mediaUrl: {
      propDefinition: [
        hamsa,
        "mediaUrl",
      ],
    },
    webhookUrl: {
      propDefinition: [
        hamsa,
        "webhookUrl",
      ],
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
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hamsa.transcribeVideo({
      mediaUrl: this.mediaUrl,
      webhookUrl: this.webhookUrl,
      webhookAuth: {
        authKey: this.webhookAuthKey || null,
        authSecret: this.webhookAuthSecret || null,
      },
    });

    $.export("$summary", "Transcription job started successfully.");
    return response;
  },
};
