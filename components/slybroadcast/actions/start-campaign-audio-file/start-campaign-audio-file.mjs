import slybroadcast from "../../slybroadcast.app.mjs";

export default {
  key: "slybroadcast-start-campaign-audio-file",
  name: "Start Campaign with Audio File",
  description: "Start a new voicemail campaign using an audio file uploaded to your slybroadcast account. [See the documentation](https://www.slybroadcast.com/documentation.php)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slybroadcast,
    audioFile: {
      propDefinition: [
        slybroadcast,
        "audioFile",
      ],
    },
    recipients: {
      propDefinition: [
        slybroadcast,
        "recipients",
      ],
    },
    date: {
      propDefinition: [
        slybroadcast,
        "date",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slybroadcast.startCampaign({
      $,
      data: {
        c_record_audio: this.audioFile,
        c_phone: this.recipients.join(),
        c_date: this.date,
      },
    });
    $.export("$summary", `Started campaign with audio file ID: ${this.audioFile}`);
    return response;
  },
};
