const axios = require("axios");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const qs = require("qs");
const twilioClient = require("twilio");

const twilio = {
  type: "app",
  app: "twilio",
  propDefinitions: {
    authToken: {
      type: "string",
      label: "Twilio Auth Token",
      description:
        "The Twilio auth token, found [in your Twilio console](https://www.twilio.com/console)",
    },
    incomingPhoneNumber: {
      type: "string",
      label: "Incoming Phone Number",
      description: "The Twilio phone number where you'll receive messages",
      async options() {
        return await this.listIncomingPhoneNumbers();
      },
    },
    responseMessage: {
      type: "string",
      label: "SMS Response Message",
      description: "The SMS message you want to send in response",
    },
  },
  methods: {
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.auth = { username: this.$auth.Sid, password: this.$auth.Secret };
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      opts.headers["Content-Type"] = "application/x-www-form-urlencoded";
      const { path } = opts;
      delete opts.path;
      opts.url = `https://api.twilio.com/2010-04-01/Accounts/${
        this.$auth.AccountSid
      }${path[0] === "/" ? "" : "/"}${path}`;
      return await axios(opts);
    },
    async setIncomingSMSWebhookURL(phoneNumberSid, url) {
      return await this._makeRequest({
        path: `/IncomingPhoneNumbers/${phoneNumberSid}.json`,
        method: "POST",
        data: qs.stringify({
          SmsMethod: "POST",
          SmsUrl: url,
        }),
      });
    },
    async deleteIncomingSMSWebhookURL(phoneNumberSid) {
      // TODO
    },
    async listIncomingPhoneNumbers() {
      const numbers = [
        {
          label: "+14154184068", // phone number
          value: "+14154184068", // Phone number SID
        },
      ];
      return numbers;
    },
  },
};

module.exports = {
  name: "Incoming SMS",
  version: "0.0.1",
  props: {
    twilio,
    incomingPhoneNumber: { propDefinition: [twilio, "incomingPhoneNumber"] },
    authToken: { propDefinition: [twilio, "authToken"] },
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    generateSecret() {
      return "" + Math.random();
    },
  },
  hooks: {
    async activate() {
      const createWebhookResp = await setIncomingSMSWebhookURL(
        this.incomingPhoneNumber,
        this.http.endpoint
      );
      console.log(createWebhookResp);
    },
    async deactivate() {
      // TODO
    },
  },
  async run(event) {
    const { body, headers } = event;
    const twiml = new MessagingResponse();

    twiml.message(this.responseMessage);

    this.http.respond({
      status: 200,
      headers: { "Content-Type": "text/xml" },
      body: twiml.toString(),
    });

    // TODO: validate incoming request
    const twilioSignature = headers["x-twilio-signature"];
    if (!twilioSignature) {
      console.log("No x-twilio-signature header in request. Exiting.");
      return;
    }

    // See https://www.twilio.com/docs/usage/security?code-sample=code-validate-signature-of-request-1&code-language=Node.js&code-sdk-version=3.x
    /* if (
      !twilioClient.validateRequest(
        this.authToken,
        twilioSignature,
        this.http.endpoint,
        body
      )
    ) {
      throw new Error("signature mismatch");
    } */

    this.$emit(body, {
      summary: JSON.stringify(body),
      id: headers["i-twilio-idempotency-token"],
    });
  },
};
