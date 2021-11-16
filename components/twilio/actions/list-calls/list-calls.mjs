import twilio from "../../twilio.app.mjs";
import { omitEmptyStringValues } from "../../utils.mjs";

export default {
  key: "twilio-list-calls",
  name: "List Calls",
  description: "Return a list of calls associated with your account. [See the docs](https://www.twilio.com/docs/voice/api/call-resource#read-multiple-call-resources) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    twilio,
    to: {
      propDefinition: [
        twilio,
        "to",
      ],
      description: "Only show calls made to this phone number, SIP address, Client identifier or SIM SID. Format the phone number in E.164 format with a + and country code (e.g., +16175551212).",
      optional: true,
    },
    // Not inheriting `propDefinition` from `twilio` because it has value for
    // `options` property
    from: {
      type: "string",
      label: "From",
      description: "Only include calls from this phone number, SIP address, Client identifier or SIM SID. Format the phone number in E.164 format with a + and country code (e.g., +16175551212).",
      optional: true,
    },
    parentCallSid: {
      propDefinition: [
        twilio,
        "parentCallSid",
      ],
    },
    status: {
      propDefinition: [
        twilio,
        "status",
      ],
    },
    limit: {
      propDefinition: [
        twilio,
        "limit",
      ],
    },
  },
  async run() {
    return this.twilio.listCalls(omitEmptyStringValues({
      to: this.to || undefined, // Use `undefined` if `to` is empty because Twilio API doesn't
      from: this.from || undefined,
      parentCallSid: this.parentCallSid || undefined,
      status: this.status || undefined,
      limit: this.limit,
    }));
  },
};
