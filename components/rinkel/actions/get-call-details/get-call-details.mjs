import rinkel from "../../rinkel.app.mjs";

export default {
  key: "rinkel-get-call-details",
  name: "Get Call Details",
  description: "Get details about a call. [See the documentation](https://developers.rinkel.com/docs/api/get-a-specific-call-detail-record)",
  version: "0.0.1",
  type: "action",
  props: {
    rinkel,
    callId: {
      propDefinition: [
        rinkel,
        "callId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rinkel.getCallDetailRecord({
      $,
      id: this.callId,
    });
    $.export("$summary", `Call details for ${this.callId} retrieved`);
    return response;
  },
};
