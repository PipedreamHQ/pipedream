import esendex from "../../esendex.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "esendex-send-voice-message",
  name: "Send Voice Message",
  description: "Send a voice message to a recipient. [See the documentation](https://developers.esendex.com/api-reference/#messagedispatcher)",
  version: "0.0.1",
  type: "action",
  props: {
    esendex,
    accountReference: {
      propDefinition: [
        esendex,
        "accountReference",
      ],
    },
    to: {
      type: "string",
      label: "To",
      description: "The phone number to send the message to. E.g. `447700900123`",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send",
    },
    from: {
      type: "string",
      label: "From",
      description: "The default alphanumeric originator that the message appears to originate from. This must be either a valid phone number or an alphanumeric value with a maximum length of 11 characters, that may contain letters, numbers and the following special characters: * $ ? ! ” # % & _ - , @ ' +. Special characters may not work for all networks in France.",
      optional: true,
    },
    sendAt: {
      type: "string",
      label: "Send At",
      description: "The scheduled time to send the messages in this request. The format is `yyyy-MM-ddThh:mm:ssZ` where y=year, M=month, d=day, T=separator, h=hour, m=min and s=seconds. The value is treated as per ISO 8601 semantics, e.g. without time zone information the value is assumed to be the local time of the server, otherwise as an offset from UTC with Z representing a UTC time.",
      optional: true,
    },
    characterSet: {
      type: "string",
      label: "Character Set",
      description: "The character set of the message to be used. Valid values are: GSM, Unicode and Auto. When using Auto the most appropriate character set is automatically detected. The default value is GSM. When using auto, if unicode characters are detected, the number of characters available in a message will change from 160 to 70.",
      options: constants.CHARACTER_SETS,
      optional: true,
    },
    lang: {
      type: "string",
      label: "Language",
      description: "The language to use for this Voice message",
      options: constants.LANGUAGES,
    },
    retries: {
      type: "integer",
      label: "Retries",
      description: "The number of times to attempt to call and deliver a Voice message",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.esendex.sendMessage({
      $,
      data: {
        accountreference: this.accountReference,
        sendat: this.sendAt,
        messages: [
          {
            to: this.to,
            body: this.message,
            from: this.from,
            type: "Voice",
            characterset: this.characterSet,
            lang: this.lang,
            retries: this.retries,
          },
        ],
      },
    });
    $.export("$summary", `Successfully sent voicemessage to ${this.to}`);
    return response;
  },
};
