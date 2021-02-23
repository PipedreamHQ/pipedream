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
    body: {
      type: 'string',
      label: 'Message Body',
      description: 'The text of the message you want to send, limited to 1600 characters.'
    },
    from: {
      type: "string",
      label: "From",
      async options() {
        const client = this.getClient();
        const numbers = await client.incomingPhoneNumbers.list();
        return numbers.map((number) => {
          return number.friendlyName
        });
      },
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
    mediaUrl: {
      type: 'string[]',
      label: 'Media URL',
      description: 'The URL of the media you wish to send out with the message. The media size limit is `5MB`. You may provide up to 10 media URLs per message.',
      optional: true
    },
    responseMessage: {
      type: "string",
      optional: true,
      label: "SMS Response Message",
      description:
        "The message you want to send in response to incoming messages. Leave this blank if you don't need to issue a response.",
    },
    to: {
      type: 'string',
      label: 'To',
      description: 'The destination phone number in E.164 format. Format with a `+` and country code (e.g., `+16175551212`).'
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
