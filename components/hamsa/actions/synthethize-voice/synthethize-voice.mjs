import hamsa from "../../hamsa.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "hamsa-synthesize-voice",
  name: "Synthesize Voice",
  description: "Converts text input into artificial speech using Hamsa. [See the documentation](https://docs.tryhamsa.com/api-reference/endpoint/generate-tts)",
  version: "0.0.1",
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
      propDefinition: [
        hamsa,
        "text",
      ],
    },
    webhookUrl: {
      propDefinition: [
        hamsa,
        "webhookUrl",
      ],
    },
    authKey: {
      type: "string",
      label: "Webhook Auth Key",
      description: "Authorization key for the webhook notifications.",
      optional: true,
    },
    authSecret: {
      type: "string",
      label: "Webhook Auth Secret",
      description: "Authorization secret for the webhook notifications.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hamsa.generateTTS({
      voiceId: this.voiceId,
      text: this.text,
      webhookUrl: this.webhookUrl,
      webhookAuth: {
        authKey: this.authKey,
        authSecret: this.authSecret,
      },
    });

    $.export("$summary", `Text to speech job successfully created with ID ${response.id}`);
    return response;
  },
};
