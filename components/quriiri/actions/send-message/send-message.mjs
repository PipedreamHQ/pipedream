import { ConfigurationError } from "@pipedream/platform";
import {
  DR_TYPE_OPTIONS,
  SENDER_TYPE_OPTIONS,
} from "../../common/constants.mjs";
import quriiri from "../../quriiri.app.mjs";

export default {
  key: "quriiri-send-message",
  name: "Send Message",
  description: "Sends an SMS message using the Quriiri API. [See the documentation](https://docs.quriiri.fi/docs/quriiri/send-sms/operations/create-a)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quriiri,
    sender: {
      type: "string",
      label: "Sender",
      description: "Message sender. International numbers with + or 00 prefix and 5 to 15 numbers following it, national ones / shortcodes with 1 to 15 numbers, alphanumeric with max 11 characters. Although other characters may work, we cannot guarantee it and recommend restricting the characters used in alphanumeric senders to letters A-Z and a-z, and digits 0-9.",
      optional: true,
    },
    senderType: {
      type: "string",
      label: "Sender Type",
      description: "Sender type. If missing, an attempt is made to guess one from the sender, and guess failure results in an error.",
      options: SENDER_TYPE_OPTIONS,
      optional: true,
    },
    destination: {
      type: "string",
      label: "Destination",
      description: "Message destination number in international or national format. International numbers should begin with + or 00 prefix and national format numbers will be converted to Finnish ones. For maximum reliability, we recommend using only international format numbers, with nothing but digits following the international prefix. The HTTP response contains information about which international number each accepted destination was converted to or treated as. Accepts multiple values array in JSON, set multiple times with form POST and GET.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Message text. Based on the text, the service automatically determines whether the message can be sent using the GSM character set or if sending it as Unicode is required. Also, the service determines automatically how many SMS messages sending the message will require. The general rule of thumb is that the first SMS using the GSM character set can hold up to 160 characters; if there are more, concatenation is required and each SMS (including the first one) can hold up to 153 characters. Note that some characters in the GSM character set will consume two characters instead of one. For Unicode, the corresponding numbers are 70 and 67. If text is provided, data is ignored. Message templates can be used by finding the template ID from the UI and using {template_ID} placeholder, e.g. \"Hello ${template_361}!\"",
      optional: true,
    },
    data: {
      type: "string",
      label: "Data",
      description: "Binary message data, bytes encoded as hexadecimal characters. If text is provided, data is ignored. Maximum number of bytes in udh and data combined is 140.",
      optional: true,
    },
    udh: {
      type: "string",
      label: "UDH",
      description: "User data header, bytes encoded as hexadecimal characters. Maximum number of bytes in udh and data combined is 140. Note that concatenated text messages may be sent using the entire message context in the text parameter, without setting udh, and the service will take care of splitting the message into appropriately sized parts.",
      optional: true,
    },
    batchId: {
      type: "string",
      label: "Batch ID",
      description: "Batch ID, max 255 characters. Used to group interrelated messages, for example if some special actions should be taken to a group of separately sent but logically related messages. Under normal circumstances, the service does not use this parameter but just relays it back in corresponding delivery reports.",
      optional: true,
    },
    billingRef: {
      type: "string",
      label: "Billing Reference",
      description: "Billing reference, max 255 characters. This is solely for the API user, the service does not do anything else with it besides relaying it back in corresponding delivery reports.",
      optional: true,
    },
    drUrl: {
      type: "string",
      label: "Delivery Receipt URL",
      description: "Delivery report URL. URL where to relay delivery reports",
      optional: true,
    },
    drType: {
      type: "string",
      label: "Delivery Receipt Type",
      description: "Delivery report type. Similarly as for supported API request types. Defaults to the format of the API request.",
      options: DR_TYPE_OPTIONS,
      optional: true,
    },
    flash: {
      type: "boolean",
      label: "Flash",
      description: "Send a \"flash\" SMS if set to true.",
      optional: true,
    },
    validity: {
      type: "integer",
      label: "Validity",
      description: "Validity period of the message in minutes. If not set, defaults to the value set in your account details.",
      min: 1,
      max: 32767,
      optional: true,
    },
    scheduleTime: {
      type: "string",
      label: "Schedule Time",
      description: "Schedule time can be used for message scheduling. If a message is scheduled, the API response contains messageid for later message cancellation, if needed. Schedule time must be set in `RFC 3339` format, ie. `2020-05-31T04:20:03Z`. In scheduling the seconds and milliseconds are ignored, so every scheduled message is sent in a resolution of minutes.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.text && !this.data) {
      throw new ConfigurationError("You must provide either 'Data' or 'Text' input.");
    }
    const response = await this.quriiri.sendSms({
      $,
      data: {
        sender: this.sender,
        destinations: this.destination,
        text: this.text,
        sendertype: this.senderType,
        data: this.data,
        udh: this.udh,
        batchid: this.batchId,
        billingref: this.billingRef,
        drurl: this.drUrl,
        drtype: this.drType,
        flash: this.flash,
        validity: this.validity,
        scheduletime: this.scheduleTime,
      },
    });
    $.export("$summary", `Message sent successfully to ${this.destination}`);
    return response;
  },
};
