import app from "../../seven.app.mjs";

export default {
  key: "seven-send-voice-call",
  name: "Send Voice Call",
  description: "Create a TTS (Text-to-Speech) voice call to a number. [See the documentation](https://docs.seven.io/en/rest-api/endpoints/voice#send-voice-call)",
  version: "0.0.{{ts}}",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    to: {
      type: "string",
      label: "To",
      description: "Recipient number(s) of the voice calls. This can also be the name of a contact or a group. Our API accepts all common formats like 0049171123456789, 49171123456789, +49171123456789. Multiple recipients are passed separated by commas. Ideally, you should provide the phone number in the international format according to [E.164](https://de.wikipedia.org/wiki/E.164)",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text message to be read out. Optionally as simple text or as [SSML](https://docs.seven.io/en/rest-api/endpoints/voice#ssml)",
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

    const response = await this.app.sendVoiceCall({
      $,
      data,
    });

    $.export("$summary", "Successfully initiated voice call");
    return response;
  },
};
