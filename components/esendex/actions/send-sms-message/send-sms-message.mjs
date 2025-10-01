import esendex from "../../esendex.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "esendex-send-sms-message",
  name: "Send SMS Message",
  description: "Send an SMS message to a recipient. [See the documentation](https://developers.esendex.com/api-reference/#messagedispatcher)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    validity: {
      type: "integer",
      label: "Validity",
      description: "The validity period for this message in hours (default to 0 which indicates the MAX allowed). The maximum allowed validity period is 72 hours.",
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
            type: "SMS",
            characterset: this.characterSet,
            validity: this.validity,
          },
        ],
      },
    });
    $.export("$summary", `Successfully sent SMS message to ${this.to}`);
    return response;
  },
};
