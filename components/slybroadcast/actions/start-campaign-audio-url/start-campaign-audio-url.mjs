import slybroadcast from "../../slybroadcast.app.mjs";

export default {
  key: "slybroadcast-start-campaign-audio-url",
  name: "Start Campaign With Audio URL",
  description: "Launch a new voicemail campaign to an individual or a group using an audio file url",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    slybroadcast,
    recipients: {
      propDefinition: [
        slybroadcast,
        "recipients",
      ],
      description: "List of recipients for the voicemail campaign",
    },
    audioFileUrl: {
      propDefinition: [
        slybroadcast,
        "audioFileUrl",
      ],
      description: "The URL of the audio file for the voicemail campaign",
    },
  },
  async run({ $ }) {
    const response = await this.slybroadcast.startCampaignWithFileUrl({
      audioFileUrl: this.audioFileUrl,
      recipients: this.recipients,
    });
    $.export("$summary", "Campaign started successfully");
    return response;
  },
};
