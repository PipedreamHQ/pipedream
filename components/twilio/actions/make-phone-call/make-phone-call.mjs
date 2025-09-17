import { phone } from "phone";
import twilio from "../../twilio.app.mjs";
import { callToString } from "../../common/utils.mjs";

export default {
  key: "twilio-make-phone-call",
  name: "Make a Phone Call",
  description: "Make a phone call passing text, a URL, or an application that Twilio will use to handle the call. [See the documentation](https://www.twilio.com/docs/voice/api/call-resource#create-a-call-resource)",
  version: "0.1.6",
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
    callType: {
      type: "string",
      label: "Call Type",
      description: "Whether to use `text`, a `URL`, or an `application` to handle the call",
      options: [
        {
          label: "Enter text for Twilio to speak when the user picks up the phone",
          value: "text",
        },
        {
          label: "Enter a URL that returns the TwiML instructions for the call",
          value: "url",
        },
        {
          label: "Enter the SID of an Application resource that will handle the call",
          value: "application",
        },
      ],
      reloadProps: true,
    },
    text: {
      label: "Text",
      type: "string",
      description: "The text you'd like Twilio to speak to the user when they pick up the phone.",
      hidden: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The absolute URL that returns the TwiML instructions for the call",
      hidden: true,
    },
    applicationSid: {
      propDefinition: [
        twilio,
        "applicationSid",
      ],
      hidden: true,
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
      reloadProps: true,
    },
  },
  async additionalProps(existingProps) {
    const props = {};
    existingProps.text.hidden = !(this.callType === "text");
    existingProps.url.hidden = !(this.callType === "url");
    existingProps.applicationSid.hidden = !(this.callType === "application");
    if (this.record) {
      props.trim = {
        type: "string",
        label: "Trim",
        description: "Whether to trim any leading and trailing silence from the recording",
        options: [
          "trim-silence",
          "do-not-trim",
        ],
        optional: true,
      };
      props.recordingTrack = {
        type: "string",
        label: "Recording Track",
        description: "The audio track to record for the call. Default is `both`.",
        options: [
          "inbound",
          "outbound",
          "both",
        ],
        optional: true,
      };
      props.recordingCallbackUrl = {
        type: "string",
        label: "Recording Callback URL",
        description: "The URL that we call when the recording is available to be accessed",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
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
