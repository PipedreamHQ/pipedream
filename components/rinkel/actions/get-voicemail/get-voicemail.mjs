import rinkel from "../../rinkel.app.mjs";

export default {
  key: "rinkel-get-voicemail",
  name: "Get Voicemail",
  description: "Returns a URL to stream or download a voicemail. [See the documentation](https://developers.rinkel.com/docs/api/get-a-temporary-url-to-stream-or-download-a-voicemail)",
  version: "0.0.1",
  type: "action",
  props: {
    rinkel,
    voicemailId: {
      propDefinition: [
        rinkel,
        "voicemailId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rinkel.getVoicemail({
      $,
      id: this.voicemailId,
    });
    $.export("$summary", `Voicemail ${this.voicemailId} retrieved`);
    return response;
  },
};
