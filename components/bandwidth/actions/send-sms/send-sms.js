const bandwidth = require("../../bandwidth.app.js");

module.exports = {
  key: "bandwidth-send-sms",
  name: "Send SMS",
  description: "Send an SMS message using Bandwidth's Messaging API",
  type: "action",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bandwidth,
    messageTo: {
      propDefinition: [
        bandwidth,
        "messageTo",
      ],
    },
    from: {
      propDefinition: [
        bandwidth,
        "from",
      ],
    },
    message: {
      propDefinition: [
        bandwidth,
        "message",
      ],
    },
    messagingApplicationId: {
      propDefinition: [
        bandwidth,
        "messagingApplicationId",
      ],
    },
  },
  async run () {
    const response = await this.bandwidth.sendSms(
      this.messageTo,
      this.from,
      this.message,
      this.messagingApplicationId,
    );
    console.log("Status Code:", response.statusCode);
    console.log("Message ID:", response.result.id);
    return response;
  },
};
