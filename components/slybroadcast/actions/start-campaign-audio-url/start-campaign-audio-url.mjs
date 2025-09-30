import slybroadcast from "../../slybroadcast.app.mjs";

export default {
  key: "slybroadcast-start-campaign-audio-url",
  name: "Start Campaign With Audio URL",
  description: "Launch a new voicemail campaign to an individual or a group using an audio file url. [See the documentation](https://www.slybroadcast.com/documentation.php)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slybroadcast,
    audioFileUrl: {
      type: "string",
      label: "Audio File URL",
      description: "The URL of the audio file for the voicemail campaign",
    },
    audioFileType: {
      type: "string",
      label: "Audio File Type",
      description: "WAV, Mp3 or M4a",
      options: [
        "WAV",
        "Mp3",
        "M4a",
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
        c_url: this.audioFileUrl,
        c_audio: this.audioFileType,
        c_phone: this.recipients.join(),
        c_date: this.date,
      },
    });
    $.export("$summary", "Campaign started successfully");
    return response;
  },
};
