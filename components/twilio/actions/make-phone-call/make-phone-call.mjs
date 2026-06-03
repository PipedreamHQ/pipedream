import { phone } from "phone";
import twilio from "../../twilio.app.mjs";
import { callToString } from "../../common/utils.mjs";

export default {
  key: "twilio-make-phone-call",
  name: "Make a Phone Call",
  description: "Make a phone call passing text, a URL, or an application that Twilio will use to handle the call. [See the documentation](https://www.twilio.com/docs/voice/api/call-resource#create-a-call-resource)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    twilio,
    from: {
      propDefinition: [
        twilio,
        "from",
      ],
    },
    to: {
      propDefinition: [
        twilio,
        "to",
      ],
    },
    text: {
      label: "Text",
      type: "string",
      description: "Call handler — choose **one** of **Text**, **URL**, or **Application SID**. Set this field to handle the call with **text**: the message Twilio will speak to the user when they pick up the phone.",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "Call handler — choose **one** of **Text**, **URL**, or **Application SID**. Set this field to handle the call with a **URL**: the absolute URL that returns the TwiML instructions for the call.",
      optional: true,
    },
    applicationSid: {
      propDefinition: [
        twilio,
        "applicationSid",
      ],
      description: "Call handler — choose **one** of **Text**, **URL**, or **Application SID**. Set this field to handle the call with an **application**: the SID of the Application resource that will handle the call.",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "The integer number of seconds that we should allow the phone to ring before assuming there is no answer. The default is `60` seconds and the maximum is `600` seconds.",
      optional: true,
    },
    record: {
      type: "boolean",
      label: "Record",
      description: "Whether to record the call",
      optional: true,
    },
    trim: {
      type: "string",
      label: "Trim",
      description: "Whether to trim any leading and trailing silence from the recording. Only applies when **Record** is enabled.",
      options: [
        "trim-silence",
        "do-not-trim",
      ],
      optional: true,
    },
    recordingTrack: {
      type: "string",
      label: "Recording Track",
      description: "The audio track to record for the call. Default is `both`. Only applies when **Record** is enabled.",
      options: [
        "inbound",
        "outbound",
        "both",
      ],
      optional: true,
    },
    recordingCallbackUrl: {
      type: "string",
      label: "Recording Callback URL",
      description: "The URL that we call when the recording is available to be accessed. Only applies when **Record** is enabled.",
      optional: true,
    },
  },
  async run({ $ }) {
    // Exactly one of the call handlers (text, URL, or application) must be provided
    const handlers = [
      this.text,
      this.url,
      this.applicationSid,
    ].filter((handler) => handler != null && handler !== "");
    if (handlers.length !== 1) {
      throw new Error("You must provide exactly one of **Text**, **URL**, or **Application SID** to handle the call.");
    }

    // Parse the given number into its E.164 equivalent
    // The E.164 phone number will be included in the first element
    // of the array, but the array will be empty if parsing fails.
    // See https://www.npmjs.com/package/phone
    const toParsed = phone(this.to);
    console.log(toParsed);
    if (!toParsed || !toParsed.phoneNumber) {
      throw new Error(`Phone number ${this.to} could not be parsed as a valid number.`);
    }

    const fromParsed = phone(this.from);
    if (!fromParsed || !fromParsed.phoneNumber) {
      throw new Error(`Phone number ${this.from} could not be parsed as a valid number.`);
    }

    const data = {
      to: toParsed.phoneNumber,
      from: fromParsed.phoneNumber,
      twiml: this.text && `<Response><Say>${this.text}</Say></Response>`,
      url: this.url,
      applicationSid: this.applicationSid,
      timeout: this.timeout,
      record: this.record,
      trim: this.trim,
      recordingTrack: this.recordingTrack,
      recordingStatusCallback: this.recordingCallbackUrl,
    };

    const resp = await this.twilio.getClient().calls.create(data);
    $.export("$summary", `Successfully made a new phone call, "${callToString(resp)}"`);
    return resp;
  },
};
