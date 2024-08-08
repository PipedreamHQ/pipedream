import twilio from "../../twilio.app.mjs";

export default {
  key: "twilio-delete-call",
  name: "Delete Call",
  description: "Remove a call record from your account. [See the documentation](https://www.twilio.com/docs/voice/api/call-resource#delete-a-call-resource)",
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
    const resp = await this.twilio.deleteCall(this.sid);
    $.export("$summary", `Successfully deleted the call, "${this.sid}"`);
    return resp;
  },
};
