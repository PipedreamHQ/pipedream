import twilio from "../../twilio.app.mjs";
import { omitEmptyStringValues } from "../../common/utils.mjs";

export default {
  key: "twilio-list-calls",
  name: "List Calls",
  description: "Return a list of calls associated with your account. [See the documentation](https://www.twilio.com/docs/voice/api/call-resource#read-multiple-call-resources)",
  version: "0.1.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    twilio,
    from: {
      propDefinition: [
        twilio,
        "from",
      ],
      description: "Only include calls from this phone number, SIP address, Client identifier or SIM SID. Format the phone number in E.164 format with a `+` and country code (e.g., `+16175551212`).",
      optional: true,
    },
    to: {
      propDefinition: [
        twilio,
        "to",
      ],
      description: "Only show calls made to this phone number, SIP address, Client identifier or SIM SID. Format the phone number in E.164 format with a `+` and country code (e.g., `+16175551212`).",
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
  async run({ $ }) {
    const resp = await this.twilio.listCalls(omitEmptyStringValues({
      to: this.to,
      from: this.from,
      parentCallSid: this.parentCallSid,
      status: this.status,
      limit: this.limit,
    }));
    /* eslint-disable multiline-ternary */
    $.export("$summary", `Successfully fetched ${resp.length} call${resp.length === 1 ? "" : "s"}${
      this.from ? ` from ${this.from}` : ""}${this.to ? ` to ${this.to}` : ""}`);
    return resp;
  },
};
