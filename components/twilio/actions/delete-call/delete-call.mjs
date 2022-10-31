import twilio from "../../twilio.app.mjs";

export default {
  key: "twilio-delete-call",
  name: "Delete Call",
  description: "Remove a call record from your account. [See the docs](https://www.twilio.com/docs/voice/api/call-resource#delete-a-call-resource) for more information",
  version: "0.1.1",
  type: "action",
  props: {
    twilio,
    sid: {
      propDefinition: [
        twilio,
        "sid",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.twilio.deleteCall(this.sid);
    $.export("$summary", `Successfully deleted the call, "${this.sid}"`);
    return resp;
  },
};
