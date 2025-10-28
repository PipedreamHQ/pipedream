import app from "../../inmobile.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "inmobile-send-sms-messages",
  name: "Send SMS Messages",
  description: "Send one or more SMS messages using the InMobile API. [See the documentation](https://www.inmobile.com/docs/rest-api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    app,
    messages: {
      type: "string[]",
      label: "Messages",
      description: `An array of message objects (1-250 messages). Each message object supports the following properties:

**Required Fields:**
- \`to\` (string): The msisdn (country code and number) to send to. Remember to include country code, e.g. \`4512345678\`
- \`text\` (string): The text message (1-10000 characters)
- \`from\` (string): The sender. Can be a 3-11 character text sender or up to 14 digit sender number

**Optional Fields:**
- \`countryHint\` (string): Country code for optimal phone number validation, e.g. \`44\` or \`GB\`
- \`messageId\` (string): Optional message ID to identify the message (1-50 characters, must be unique)
- \`respectBlacklist\` (boolean): Block message if target number is blacklisted. Default: \`true\`
- \`validityPeriodInSeconds\` (integer): Validity period (60-172800 seconds). Default: \`172800\` (48 hours)
- \`statusCallbackUrl\` (string): URL for delivery status callbacks
- \`sendTime\` (string): Schedule message for future sending, e.g. \`2024-12-31T14:50:23Z\` (UTC time)
- \`msisdnCooldownInMinutes\` (integer): Prevent sending to same number within period (60-43200 minutes)
- \`flash\` (boolean): Send as flash message (class0). Default: \`false\`
- \`encoding\` (string): Message encoding - \`gsm7\` (default, 160 chars), \`ucs2\` (70 chars), or \`auto\`

**Example:**
\`\`\`json
[
  {
    "to": "4512345678",
    "text": "Hello World",
    "from": "YourSender",
    "encoding": "gsm7"
  },
  {
    "to": "4587654321",
    "text": "Another message",
    "from": "YourSender",
    "flash": true
  }
]
\`\`\``,
    },
  },
  async run({ $ }) {
    const {
      app,
      messages,
    } = this;

    const response = await app.sendSms({
      $,
      data: {
        messages: utils.parseArray(messages),
      },
    });

    $.export("$summary", "Successfully sent SMS messages");
    return response;
  },
};
