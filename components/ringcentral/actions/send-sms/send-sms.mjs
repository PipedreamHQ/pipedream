import ringcentral from "../../ringcentral.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ringcentral-send-sms",
  name: "Send SMS",
  description: "Creates and sends a new text message. See the API docs [here](https://developers.ringcentral.com/api-reference/SMS/createSMSMessage)",
  version: "0.5.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ringcentral,
    accountId: {
      propDefinition: [
        ringcentral,
        "accountId",
      ],
    },
    extensionId: {
      propDefinition: [
        ringcentral,
        "extensionId",
      ],
      description: "Internal identifier of an extension.",
    },
    fromPhoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phoneNumber for the sender of an SMS message. Property must be filled to correspond to one of the account phone numbers which is allowed to send SMS. Phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164#Numbering_formats) e.g. `+16502223366`.",
    },
    toPhoneNumbers: {
      type: "string[]",
      label: "To Phone Numbers",
      description: "Phone number of receiver(s) of an SMS message. Phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164#Numbering_formats) e.g. `+16502223366`.",
    },
    text: {
      type: "string",
      description: "Text of a message. Max length is 1000 symbols (2-byte [UTF-16](https://en.wikipedia.org/wiki/UTF-16) encoded). If a character is encoded in 4 bytes in UTF-16 it is treated as 2 characters, thus restricting the maximum message length to 500 symbols.",
    },
    countryId: {
      propDefinition: [
        ringcentral,
        "countryId",
      ],
    },
  },
  async run({ $ }) {
    const {
      accountId,
      extensionId,
      fromPhoneNumber,
      text,
      countryId,
    } = this;

    const toPhoneNumbers = utils.parse(this.toPhoneNumbers);
    const to = toPhoneNumbers.map((phoneNumber) => ({
      phoneNumber,
    }));

    const response =
      await this.ringcentral.sendSMS({
        $,
        accountId,
        extensionId,
        data: {
          from: {
            phoneNumber: fromPhoneNumber,
          },
          to,
          text,
          country: utils.emptyObjectToUndefined({
            id: countryId,
          }),
        },
      });

    $.export("$summary", `Successfully sent SMS with ID ${response.id}`);

    return response;
  },
};
