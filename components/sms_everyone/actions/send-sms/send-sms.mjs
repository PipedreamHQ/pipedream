import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import smsEveryone from "../../sms_everyone.app.mjs";

export default {
  key: "sms_everyone-send-sms",
  name: "Send SMS",
  description: "Send an SMS message or a bulk SMS campaign. [See the documentation](https://www.smseveryone.com.au/restapi)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smsEveryone,
    originator: {
      type: "string",
      label: "Originator",
      description: "Sender Number. Check the restrictions in your country as to whether you can use a word origin. If you send from a number, use international format without the + sign.",
    },
    destinations: {
      type: "string[]",
      label: "Destinations",
      description: "Phone number/s of the recipient/s. Ideally this should also be sent in international format without the + sign.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message content.",
    },
    timescheduled: {
      type: "string",
      label: "Time Scheduled",
      description: "If you're scheduling a message, include this field. Format: \"YYYYMMDDHHMM\" **If you're sending now, this field is not necessary**. If yuo set the date/time in the past, the SMS will be sent immediately.",
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Your unique reference ID of the message.",
      optional: true,
    },
    crmids: {
      propDefinition: [
        smsEveryone,
        "crmids",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.destinations && !this.crmids) {
      throw new ConfigurationError("You must provide at least Destinations or CRM IDs.");
    }
    const response = await this.smsEveryone.sendSMS({
      $,
      data: {
        Originator: this.originator,
        Destinations: parseObject(this.destinations),
        Message: this.message,
        TimeScheduled: this.timescheduled,
        Reference: this.reference,
        Action: "create",
        CrmIds: parseObject(this.crmids),
      },
    });

    if (response.Code) throw new ConfigurationError(response.Message);

    $.export("$summary", `Successfully sent sms with CampaignId: ${response.CampaignId}`);
    return response;
  },
};
