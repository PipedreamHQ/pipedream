import twilio from "../../twilio.app.mjs";
import { callToString } from "../../common/utils.mjs";

export default {
  key: "twilio-get-call",
  name: "Get Call",
  description: "Return call resource of an individual call. [See the documentation](https://www.twilio.com/docs/voice/api/call-resource#fetch-a-call-resource)",
  version: "0.1.3",
  type: "action",
  props: {
    twilio,
    sid: {
      propDefinition: [
        twilio,
        "sid",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.twilio.getCall(this.sid);
    $.export("$summary", `Successfully fetched the call, "${callToString(resp)}"`);
    return resp;
  },
};
