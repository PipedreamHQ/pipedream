const twilioClient = require("twilio");

module.exports = {
  type: "app",
  app: "twilio",
  propDefinitions: {
    authToken: {
      type: "string",
      secret: true,
      label: "Twilio Auth Token",
      description:
        "Your Twilio auth token, found [in your Twilio console](https://www.twilio.com/console). Required for validating Twilio events.",
    },
    incomingPhoneNumber: {
      type: "string",
      label: "Incoming Phone Number",
      description:
        "The Twilio phone number where you'll receive messages. This source creates a webhook tied to this incoming phone number, **overwriting any existing webhook URL**.",
      async options() {
        return await this.listIncomingPhoneNumbers();
      },
    },
    responseMessage: {
      type: "string",
      label: "SMS Response Message",
      description:
        "The message you want to send in response to incoming messages",
    },
  },
  methods: {
    getClient() {
      return twilioClient(this.$auth.Sid, this.$auth.Secret, {
        accountSid: this.$auth.AccountSid,
      });
    },
    async setIncomingSMSWebhookURL(phoneNumberSid, url) {
      const client = this.getClient();
      return await client.incomingPhoneNumbers(phoneNumberSid).update({
        smsMethod: "POST",
        smsUrl: url,
      });
    },
    async listIncomingPhoneNumbers() {
      const client = this.getClient();
      const numbers = await client.incomingPhoneNumbers.list();
      return numbers.map((number) => {
        return { label: number.friendlyName, value: number.sid };
      });
    },
  },
};
