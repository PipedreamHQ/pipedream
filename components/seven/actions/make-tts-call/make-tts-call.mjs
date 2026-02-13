import seven from "../../seven.app.mjs";

export default {
  key: "seven-make-tts-call",
  name: "Make TTS Call",
  description: "Make a text-to-speech call via Seven. [See the documentation](https://docs.seven.io/en/rest-api/endpoints/voice#send-voice-call)",
  version: "0.1.0",
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
    from: {
      type: "string",
      label: "From",
      description: "Caller ID of the call. Please only use [verified sender IDs](https://help.seven.io/en/articles/9582228-verify-phone-number-as-sender-id-for-voice) or one of your numbers booked with Seven.io",
      optional: true,
    },
    ringtime: {
      type: "integer",
      label: "Ring Duration",
      description: "The duration of how long it should ring at the recipient's end before hanging up. Here, 5 to 60 seconds are possible",
      optional: true,
    },
    foreignId: {
      type: "string",
      label: "Foreign ID",
      description: "A unique ID that you can use for later assignment of the call. This ID is passed in the webhook events",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      to: this.to,
      text: this.text,
    };
    if (this.from) data.from = this.from;
    if (this.ringtime) data.ringtime = this.ringtime;
    if (this.foreignId) data.foreign_id = this.foreignId;

    const response = await this.seven.sendTtsCall({
      $,
      data,
    });
    $.export("$summary", `Successfully sent TTS call to number: ${this.to}`);
    return response;
  },
};
