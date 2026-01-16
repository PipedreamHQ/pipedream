import app from "../../clicksend.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "clicksend-send-voice-message",
  name: "Send Voice Message",
  description: "Sends a new TTS (Text-to-speech) voice calls to one or multiple recipients. [See the documentation](https://developers.clicksend.com/docs/messaging/voice-messaging/other/send-voice-message)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    to: {
      optional: false,
      propDefinition: [
        app,
        "to",
      ],
    },
    body: {
      propDefinition: [
        app,
        "body",
      ],
    },
    voiceType: {
      type: "string",
      label: "Voice Type",
      description: "The voice type. E.g `female` or `male`.",
      options: constants.VOICE_TYPES,
    },
    customString: {
      type: "string",
      label: "Custom String",
      description: "Your reference. Will be passed back with all replies and delivery reports.",
    },
    language: {
      type: "string",
      label: "Voice Language",
      description: "The voice language country",
      options: constants.LANGUAGE_OPTIONS,
      default: constants.LANGUAGE_OPTIONS[0].value,
    },
  },
  async run({ $ }) {
    const response = await this.app.sendVoiceMessage({
      $,
      data: {
        messages: [
          {
            to: this.to,
            body: this.body,
            lang: this.language,
            voice: this.voiceType,
            custom_string: this.customString,
          },
        ],
      },
    });

    $.export("$summary", `Successfully sent Voice Message with ID \`${response.data.messages[0].message_id}\``);
    return response;
  },
};
