// legacy_hash_id: a_8Ki7KQ
import { axios } from "@pipedream/platform";

export default {
  key: "ringcentral-send-sms",
  name: "Send SMS",
  description: "Creates and sends a new text message.",
  version: "0.4.1",
  type: "action",
  props: {
    ringcentral: {
      type: "app",
      app: "ringcentral",
    },
    serverURL: {
      type: "string",
      description: "The base endpoint host used for the RingCentral API.",
    },
    account_id: {
      type: "string",
      description: "Internal identifier of a RingCentral account.",
    },
    extension_id: {
      type: "string",
      description: "Internal identifier of an extension.",
    },
    phone_number: {
      type: "string",
      description: "The phoneNumber for the sender of an SMS message. Property must be filled to correspond to one of the account phone numbers which is allowed to send SMS.",
    },
    to: {
      type: "any",
      description: "Receiver of an SMS message. The phoneNumber property must be filled.",
    },
    text: {
      type: "string",
      description: "Text of a message. Max length is 1000 symbols (2-byte UTF-16 encoded). If a character is encoded in 4 bytes in UTF-16 it is treated as 2 characters, thus restricting the maximum message length to 500 symbols.",
    },
    country: {
      type: "object",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs here: https://developers.ringcentral.com/api-reference/SMS/createSMSMessage

    const config = {
      method: "post",
      url: `${this.serverURL}/restapi/v1.0/account/${this.account_id}/extension/${this.extension_id}/sms`,
      headers: {
        Authorization: `Bearer ${this.ringcentral.$auth.oauth_access_token}`,
      },
      data: {
        from: {
          phoneNumber: this.phone_number,
        },
        to: this.to,
        text: this.text,
        country: this.country,
      },
    };
    return await axios($, config);
  },
};
