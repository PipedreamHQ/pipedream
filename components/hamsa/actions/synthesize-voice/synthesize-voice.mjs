import hamsa from "../../hamsa.app.mjs";

export default {
  key: "hamsa-synthesize-voice",
  name: "Synthesize Voice",
  description: "Converts text input into artificial speech using Hamsa. [See the documentation](https://docs.tryhamsa.com/api-reference/endpoint/generate-tts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hamsa,
    voiceId: {
      propDefinition: [
        hamsa,
        "voiceId",
      ],
    },
    text: {
      type: "string",
      label: "Text for TTS",
      description: "The text you want to convert to speech. Minimum 5 words required.",
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
      description: "Authorization key for the webhook notifications.",
      optional: true,
    },
    webhookAuthSecret: {
      type: "string",
      label: "Webhook Auth Secret",
      description: "Authorization secret for the webhook notifications.",
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
      voiceId: this.voiceId,
      text: this.text,
      webhookUrl: this.webhookUrl,
    };
    if (Object.keys(webhookAuth).length) {
      data.webhookAuth = webhookAuth;
    }
    const response = await this.hamsa.generateTTS({
      $,
      data,
    });

    $.export("$summary", `Text to speech job successfully created with ID ${response.data.id}`);
    return response;
  },
};
