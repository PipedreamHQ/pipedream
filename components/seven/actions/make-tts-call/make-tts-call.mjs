import seven from "../../seven.app.mjs";

export default {
  key: "seven-make-tts-call",
  name: "Make TTS Call",
  description: "Make a text-to-speech call via Seven. [See the documentation](https://docs.seven.io/en/rest-api/endpoints/voice#send-voice-call)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    seven,
    to: {
      propDefinition: [
        seven,
        "to",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text message to be read out",
    },
  },
  async run({ $ }) {
    const response = await this.seven.sendTtsCall({
      $,
      data: {
        to: this.to,
        text: this.text,
      },
    });
    $.export("$summary", `Successfully sent TTS call to number: ${this.to}`);
    return response;
  },
};
