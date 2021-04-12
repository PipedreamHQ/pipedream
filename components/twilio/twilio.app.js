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
        const numbers = await this.listIncomingPhoneNumbers();
        return numbers.map((number) => {
          return { label: number.friendlyName, value: number.sid };
        });
      },
    },
    responseMessage: {
      type: "string",
      optional: true,
      label: "Response Message",
      description:
        "The message you want to send in response to incoming messages. Leave this blank if you don't need to issue a response.",
    },
  },
  methods: {
    getClient() {
      return twilioClient(this.$auth.Sid, this.$auth.Secret, {
        accountSid: this.$auth.AccountSid,
      });
    },
    async setWebhookURL(phoneNumberSid, params) {
      const client = this.getClient();
      return await client.incomingPhoneNumbers(phoneNumberSid).update(params);
    },
    async setIncomingSMSWebhookURL(phoneNumberSid, url) {
      const params = {
        smsMethod: "POST",
        smsUrl: url,
      };
      return await this.setWebhookURL(phoneNumberSid, params);
    },
    async setIncomingCallWebhookURL(phoneNumberSid, url) {
      const params = {
        statusCallbackMethod: "POST",
        statusCallback: url,
      };
      return await this.setWebhookURL(phoneNumberSid, params);
    },
    async listIncomingPhoneNumbers(params) {
      const client = this.getClient();
      return await client.incomingPhoneNumbers.list(params);
    },
    async listRecordings(params) {
      const client = this.getClient();
      return await client.recordings.list(params);
    },
    async listTranscriptions(params) {
      const client = this.getClient();
      return await client.transcriptions.list(params);
    },
  },
};