import alive5 from "../../alive5.app.mjs";

export default {
  key: "alive5-send-sms",
  name: "Send SMS",
  description: "Send a text message from an Alive5 SMS number. [See the documentation](https://www.alive5.com/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    alive5,
    smsLine: {
      propDefinition: [
        alive5,
        "smsLine",
      ],
    },
    userId: {
      propDefinition: [
        alive5,
        "userId",
        (c) => ({
          smsLine: c.smsLine,
        }),
      ],
    },
    to: {
      propDefinition: [
        alive5,
        "to",
      ],
    },
    message: {
      propDefinition: [
        alive5,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const [
      channelId,
      phone,
    ] = this.smsLine.split("|");
    if (!channelId || !/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error("Select a valid Alive5 SMS number.");
    if (!/^\+[1-9]\d{7,14}$/.test(this.to)) throw new Error("Use a recipient phone number with a country code, such as +14155550123.");
    if (!this.message.trim()) throw new Error("Enter a message containing text.");
    const result = await this.alive5.sendSms({
      $,
      data: {
        phone_number_from: phone,
        phone_number_to: this.to,
        channel_id: channelId,
        user_id: this.userId,
        message: this.message,
      },
    });
    $.export("$summary", "SMS submitted to Alive5.");
    return result;
  },
};
