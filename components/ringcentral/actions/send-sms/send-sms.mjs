import ringcentral from "../../ringcentral.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ringcentral-send-sms",
  name: "Send SMS",
  description: "Creates and sends a new text message. See the API docs [here](https://developers.ringcentral.com/api-reference/SMS/createSMSMessage)",
  version: "0.5.0",
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
      description: "The phoneNumber for the sender of an SMS message. Property must be filled to correspond to one of the account phone numbers which is allowed to send SMS. Phone number in E.164 format",
    },
    toPhoneNumbers: {
      type: "string[]",
      label: "To Phone Numbers",
      description: "Phone number of receiver(s) of an SMS message. Phone number in E.164 format.",
    },
    text: {
      type: "string",
      description: "Text of a message. Max length is 1000 symbols (2-byte UTF-16 encoded). If a character is encoded in 4 bytes in UTF-16 it is treated as 2 characters, thus restricting the maximum message length to 500 symbols.",
    },
    countryId: {
      type: "string",
      label: "Country ID",
      description: "Internal identifier of a country.",
      optional: true,
    },
    countryUri: {
      type: "string",
      label: "Country URI",
      description: "Canonical URI of a country.",
      optional: true,
    },
    countryName: {
      type: "string",
      label: "Country Name",
      description: "Official name of a country.",
      optional: true,
    },
    countryIsoCode: {
      type: "string",
      label: "Country ISO Code",
      description: "ISO code of a country.",
      optional: true,
    },
    countryCallingCode: {
      type: "string",
      label: "Country Calling Code",
      description: "Calling code of a country.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      accountId,
      extensionId,
      fromPhoneNumber,
      text,
      countryId,
      countryUri,
      countryName,
      countryIsoCode,
      countryCallingCode,
    } = this;

    const toPhoneNumbers = utils.parse(this.toPhoneNumbers);
    const to = toPhoneNumbers.map((phoneNumber) => ({
      phoneNumber,
    }));
    const country = utils.emptyObjectToUndefined({
      id: countryId,
      uri: countryUri,
      name: countryName,
      isoCode: countryIsoCode,
      callingCode: countryCallingCode,
    });
    console.log("country", country);

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
          country,
        },
      });

    $.export("$summary", `Successfully sent SMS with ID ${response.id}`);

    return response;
  },
};
