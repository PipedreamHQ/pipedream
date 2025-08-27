import rinkel from "../../rinkel.app.mjs";

export default {
  key: "rinkel-get-call-recording",
  name: "Get Call Recording",
  description: "Get a call recording. [See the documentation](https://developers.rinkel.com/docs/api/get-a-recording)",
  version: "0.0.1",
  type: "action",
  props: {
    rinkel,
    recordingId: {
      propDefinition: [
        rinkel,
        "recordingId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rinkel.getCallRecording({
      $,
      id: this.recordingId,
    });
    $.export("$summary", `Recording ${this.recordingId} retrieved`);
    return response;
  },
};
